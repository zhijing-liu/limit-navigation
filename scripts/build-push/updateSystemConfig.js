import { buildPath, serverMap } from "./config.js";
import { argv } from "node:process";
import { Ftp } from "../utils.js";
import { join, isAbsolute } from "node:path";
const server =
  argv.find((r) => r.includes("server="))?.slice(7) ??
  Object.keys(serverMap)[0];
const buildPathArg =
  argv.find((r) => r.includes("buildPath="))?.slice(10) ?? buildPath ?? "dist";
const path = isAbsolute(buildPathArg)
  ? buildPathArg
  : join(process.cwd(), buildPathArg);
const config = serverMap[server];
const ftp = new Ftp(config);
await ftp.connect();
await ftp.uploadDir(join(path), config.path);
ftp.close();
console.log("update success");
