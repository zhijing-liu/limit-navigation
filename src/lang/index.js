import { ref, watch } from "vue";
import { languages, targets } from "./target.js";
export * from "./target.js";
import { settings } from "../stores.js";
import { dataList } from "./dataList.js";
const loadDefault = () =>
  Object.fromEntries(dataList.map((item) => [item, item]));
const langData = ref(loadDefault());
export const getLangData = import.meta.env.DEV
  ? (key) => {
      if (key in langData.value) {
        return langData.value[key];
      } else {
        console.warn(`key "${key}" may not be translated`);
        return key;
      }
    }
  : (key) => langData.value[key] ?? key;
watch(
  () => settings.lang,
  async () => {
    settings.lang =
      languages[settings.lang] ??
      (settings.lang in targets ? settings.lang : "en");
    document.documentElement.setAttribute("lang", settings.lang);
    try {
      const { dataList } = await import(`./lib/${settings.lang}.js`);
      langData.value = dataList;
    } catch {
      loadDefault();
    }
  },
  {
    immediate: true,
  },
);
