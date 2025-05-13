import { trans } from "./src/trans.js";
import { writeFileSync, readFileSync } from "node:fs";
import { join, isAbsolute } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execSync } from "child_process";
import { argv, stdout, cwd } from "node:process";

let path = argv.find((r) => r.includes("path="))?.slice(5);
if (!isAbsolute(path)) {
  path = join(cwd(), path);
}

if (!path) {
  throw Error(
    "No path is specified , Please use ' path={{your path}} ' to specified",
  );
}
const dataList = (await import(pathToFileURL(join(path, "dataList.js"))))
  .dataList;

const targets = (await import(pathToFileURL(join(path, "target.js")))).targets;
const libPath = join(path, "./lib");
console.log(`
  ______                                    __           __     _
 /_  __/   _____  ____ _   ____    _____   / /  ____ _  / /_   (_)  ____    ____
  / /     / ___/ / __ \`/  / __ \\  / ___/  / /  / __ \`/ / __/  / /  / __ \\  / __ \\
 / /     / /    / /_/ /  / / / / (__  )  / /  / /_/ / / /_   / /  / /_/ / / / / /
/_/     /_/     \\__,_/  /_/ /_/ /____/  /_/   \\__,_/  \\__/  /_/   \\____/ /_/ /_/

`);
console.log(`开始翻译! 导出路径: ${libPath}`);
const template = readFileSync(
  join(fileURLToPath(import.meta.url), "../src/template"),
  {
    encoding: "utf8",
  },
);
const printProgressBar = (progress, consoleFn = () => {}, barLength = 40) => {
  if (stdout.clearLine) {
    stdout.clearLine();
    stdout.cursorTo(0);
    consoleFn();
    const progressBar = `${"#".repeat(Math.floor(progress * barLength))}${"-".repeat(barLength - Math.floor(progress * barLength))}`;
    stdout.write(`[${progressBar}] ${progress.toFixed(2)}%`);
    if (progress >= 1) {
      console.log("\n");
    }
  } else {
    consoleFn();
  }
};
let index = 0;
const keys = Object.keys(targets);
for (const target of keys) {
  const log = (value) => {
    printProgressBar((index / (keys.length * 3)) * 0.7);
    index++;
  };
  log(`目标语言 : ${target} 翻译中`);

  let catchList = {};
  try {
    const targetData = await import(
      pathToFileURL(join(path, `./lib/${target}.js`))
    );
    catchList = targetData.dataList ?? {};
  } catch {}
  const list = [];
  for (const key of dataList) {
    if (!(key in catchList)) {
      list.push(key);
    }
  }
  if (list.length > 0) {
    console.log(`${target} 开始翻译`);
    for (const { query, translation } of await trans(list, target)) {
      catchList[query] = translation;
    }
  }
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
  log(`目标语言 : ${target} 翻译完成`);
  const filePath = join(libPath, `./${target}.js`);
  log(`输出 : ${filePath}`);
  writeFileSync(
    filePath,
    template.replace("{{data}}", JSON.stringify(catchList)),
  );
}
printProgressBar(0.7, () => {
  console.log("正在格式化文本...\n");
});

execSync(`npx prettier --write ${path}`, {
  encoding: "utf8",
});

printProgressBar(1, () => {
  console.log("格式化文本完成\n");
});
console.log("翻译完成");
