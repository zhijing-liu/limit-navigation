import { file, write } from "bun";

const systemConfig = file("public/systemConfig.json");
const data = await systemConfig.json();
const loadIcon = async (url) => {
  return fetch(url, {
    proxy: "http://127.0.0.1:7890",
  })
    .then(async (r) => {
      const mime = r.headers.get("content-type");
      if (mime.includes("image")) {
        return {
          arrayBuffer: await r.arrayBuffer(),
          mime,
        };
      } else {
        throw Error("mime error");
      }
    })
    .then(
      ({ arrayBuffer, mime }) =>
        `data:${mime ?? "image/*"};base64,${Buffer.from(arrayBuffer).toBase64()}`,
    );
};
for (const item of data.navList.map(({ data }) => data).flat()) {
  item.iconUrl = undefined;
  if (item.iconURL === "" || !item.iconURL.startsWith("data:")) {
    const fetchUrl = item.iconURL || `${item.url}/favicon.ico`;
    await loadIcon(fetchUrl)
      .then((result) => {
        console.log(`download ${item.label}`);
        item.iconURL = result;
      })
      .catch(() => {
        console.log(`url: ${item.url} ${fetchUrl} load error`);
      });
  }
}
await write("public/systemConfig.json", JSON.stringify(data, null, 2));
console.log("finish");
