import { argv } from "node:process";
import { isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname } from "path";
import { exec } from "child_process";
import { path, outFile, extList, blackMap } from "./config.js";

// 获取输入相对路径
const reduceDir =
  argv.find((r) => r.includes("path="))?.slice(5) || path || "./src";
const orders = argv.filter((r) => /^(--).*/.test(r)).map((r) => r.slice(2));

// 获取输出相对路径
const outFileDir =
  argv.find((r) => r.includes("outFile="))?.slice(8) ||
  outFile ||
  "./src/lang/dataList.js";
// 获取脚本执行路径
const scriptPath = process.cwd();
// 获取输入绝对路径
const projectPath = isAbsolute(reduceDir)
  ? reduceDir
  : join(scriptPath, reduceDir);
// 获取输出绝对路径
const outFilePath = isAbsolute(reduceDir)
  ? outFileDir
  : join(scriptPath, outFileDir);
// 扫描翻译文件
const transFiles = [];
const getTransFiles = (path = projectPath) => {
  const items = readdirSync(path, {
    withFileTypes: true,
  });
  for (const item of items.filter((r) => !blackMap[r.name])) {
    if (item.isFile() && extList.includes(extname(item.name))) {
      transFiles.push(join(path, item.name));
    } else if (item.isDirectory()) {
      getTransFiles(join(path, item.name));
    }
  }
};
getTransFiles();
// 从翻译文件中获取需要翻译的内容
const reg = /getLangData[(]['"].*?['"][)]/g;
const result = new Set();
for (const file of transFiles) {
  const data = readFileSync(file, { encoding: "utf8" });
  const regResult = data.match(reg);
  if (regResult) {
    regResult.forEach((item) => {
      result.add(item.slice(13, -2));
    });
  }
}
// 判定是否有旧列表，如果没有clear命令则对其进行合并处理
let oldList = [];
if (!orders.includes("clear")) {
  try {
    oldList = (await import(`file://${outFilePath}`)).dataList;
  } catch {
    console.warn("dataList not found ,clear execution failed");
  }
}

const list = [...new Set([...oldList, ...result])];
const s = `export const dataList =[${list.map((t) => `"${t}"`).join(",")}];`;
// 生成翻译文件路径
writeFileSync(outFilePath, s);
console.log(`out -> ${outFilePath}`);
const childProcess = exec(
  `${argv.at(0)} ${join(fileURLToPath(import.meta.url), "../tool/index.js")} path=${join(outFilePath, "../")}`,
  {
    encoding: "utf8",
    cwd: scriptPath,
  },
  (error, stdout, stderr) => {
    if (error) {
      console.error(error);
    }
  },
);
childProcess.stdout.on("data", (data) => {
  console.log(data);
});
