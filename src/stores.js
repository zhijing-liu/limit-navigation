import { ref, toRaw, watch, computed } from "vue";
// 适配移动端
export const narrowScreen = ref(document.body.clientWidth < 600);
export const collapsed = ref(narrowScreen.value);
// 数据
export const systemConfig = ref({ navList: [], searchSource: [] });

export const getNavList = computed(() => systemConfig.value.navList ?? []);
export const getSearchSource = computed(
  () => systemConfig.value.searchSource ?? [],
);
export const getItemList = computed(() =>
  getNavList.value.map((item) => item.data).flat(),
);
export const getUrlMap = computed(() =>
  Object.fromEntries(getItemList.value.map((item) => [item.url, item])),
);
// 计数器
export const counter = ref(JSON.parse(localStorage.getItem("counter") ?? "{}"));
export const getCounter = computed(() =>
  Object.entries(counter.value)
    .sort(([, valueA], [, valueB]) => valueB - valueA)
    .map(([url]) => getUrlMap.value[url])
    .filter((item) => item)
    .slice(0, settings.recommendCount),
);
watch(
  () => counter.value,
  () => {
    localStorage.setItem("counter", JSON.stringify(toRaw(counter.value)));
  },
  { deep: true },
);
export const themePrimaryColors = reactive([
  "#FF5722",
  "#FF6F61",
  "#FF9800",
  "#FFC107",
  "#66BB6A",
  "#4CAF50",
  "#009688",
  "#008CBA",
  "#9C27B0",
  "#607D8B",
]);
// 设置
export const settings = reactive({
  darkTheme: true,
  menuDefaultExpandAll: true,
  externalDataUrl: "",
  loadDefaultConfig: true,
  listScrollAdsorption: true,
  aElementTarget: "_blank",
  lang: "zh-CHS",
  searchSource: "",
  recommendCount: 4,
  primaryColor: "#009688",
  useSearchShortcutKey: true,
  searchThreshold: 0.1,
  pinyinMatch: true,
  useSearchHistory: true,
  searchHistoryCount: 10,
  searchHistoryPrecedence: true,
  ...JSON.parse(localStorage.getItem("settings") ?? "{}"),
});
watch(
  () => settings,
  () => {
    localStorage.setItem("settings", JSON.stringify(toRaw(settings)));
  },
  {
    deep: true,
  },
);
// dialog 渲染
export const settingDialogVisible = ref(false);
export const searchDialogVisible = ref(false);

// 历史
const searchHistory = ref(
  JSON.parse(localStorage.getItem("searchHistory") ?? "{}"),
);
export const getSearchHistory = computed(() =>
  Object.values(searchHistory.value)
    .sort(({ t: t1 }, { t: t2 }) => t2 - t1)
    .slice(0, settings.searchHistoryCount),
);

export const addSearchHistory = (value) => {
  if (settings.useSearchHistory) {
    searchHistory.value = Object.fromEntries(
      [{ ...value, t: new Date().getTime() }, ...getSearchHistory.value]
        .slice(0, settings.searchHistoryCount)
        .map((item) => [item.label, item]),
    );
  }
};
export const removeSearchHistory = (value) => {
  Reflect.deleteProperty(searchHistory.value, value);
};
export const clearSearchHistory = () => {
  searchHistory.value = {};
};
watch(
  () => searchHistory.value,
  () => {
    localStorage.setItem(
      "searchHistory",
      JSON.stringify(toRaw(searchHistory.value)),
    );
  },
);
// 数据索引
export const getSearchData = computed(() =>
  settings.useSearchHistory
    ? [
        ...(settings.searchHistoryPrecedence ? getSearchHistory.value : []),
        ...getItemList.value,
        ...(!settings.searchHistoryPrecedence ? getSearchHistory.value : []),
      ]
    : getItemList.value,
);
