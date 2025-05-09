import { execSync } from "node:child_process";
import { join, basename, dirname, isAbsolute } from "node:path";
// import SftpClient from 'ssh2-sftp-client'
import { Ftp } from "../utils.js";
import { serverMap, buildPath } from "./config.js";
import { argv } from "node:process";
import { rmSync, accessSync } from "node:fs";

const server =
  argv.find((r) => r.includes("server="))?.slice(7) ??
  Object.keys(serverMap)[0];
const buildPathArg =
  argv.find((r) => r.includes("buildPath="))?.slice(10) ?? buildPath ?? "dist";
const path = isAbsolute(buildPathArg)
  ? buildPathArg
  : join(process.cwd(), buildPathArg);

if (!server || !(server in serverMap)) {
  console.error("no server found.");
  process.exit(1);
}
const config = serverMap[server];
const orders = argv.filter((r) => /^(--).*/.test(r)).map((r) => r.slice(2));
config.path = config.path.replace(/[/\\]$/, "");
console.log(`
 __               __          __  
|__) |  | | |    |  \\ | |\\ | / _\` 
|__) \\__/ | |___ |__/ | | \\| \\__> 
                                  
`);

const ftp = new Ftp(config);
const renamePath = (path) => {
  const t = new Date();
  const newDirname = `${basename(path)}-bak-${t.getFullYear()}-${t.getMonth()}-${t.getDay()}-${t.getHours()}-${t.getMinutes()}-${t.getSeconds()}`;
  return join(dirname(config.path), newDirname).replaceAll("\\", "/");
};
try {
  console.log("building");
  execSync(`pnpm build --outDir ${path}`, { encoding: "utf8" });
  console.log("Build end");
} catch {
  console.error(`Failed to build`);
  process.exit(1);
}
try {
  accessSync(path);
} catch (e) {
  console.error(`${path} not found`);
  process.exit(1);
}
try {
  console.log(`uploading from ${path} to ${config.path}`);
  await ftp.connect();
  await ftp.uploadDir(path, config.path);
} catch (err) {
  console.log(err);
  process.exit(1);
} finally {
  console.log("upload end");
  ftp.close();
}
console.log("FINISH !!!\n");
if (orders.includes("clear")) {
  rmSync(path, { recursive: true });
  console.log(`clear ${path} success!!`);
}
