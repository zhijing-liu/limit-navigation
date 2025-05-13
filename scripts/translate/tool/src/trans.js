import axios from "axios";
import CryptoJS from "crypto-js";

import { appKey, appId } from "../config.js";
const truncate = (string) => {
  const length = string.length;
  return length <= 20
    ? string
    : `${string.substring(0, 10)}${length}${string.substring(length - 10, length)}`;
};
const getQuery = (dataList) => dataList.map((r) => `q=${r}`).join("&");
export const trans = async (dataList, target) => {
  const t = new Date().getTime();
  const salt = t.toString();
  const curtime = Math.round(t / 1000);
  const sign = CryptoJS.SHA256(
    `${appId}${truncate(dataList.join(""))}${salt}${curtime}${appKey}`,
  ).toString(CryptoJS.enc.Hex);
  const {
    data: { errorCode, translateResults },
  } = await axios.get(
    `https://openapi.youdao.com/v2/api?${getQuery(dataList)}`,
    {
      params: {
        from: "auto",
        to: target,
        appKey: appId,
        sign,
        salt,
        signType: "v3",
        curtime,
      },
    },
  );
  if (errorCode === "0") {
    return translateResults.map((r) => {
      if (!r.translation.includes(" ")) {
        r.translation = r.translation.toLowerCase();
      }
      return r;
    });
  } else {
    throw new Error("请求异常");
  }
};
