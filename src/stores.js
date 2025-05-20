import { ref, toRaw, watch } from "vue";

export const systemConfig = ref({ navList: [], searchSource: [] });

export const getNavList = computed(() => systemConfig.value.navList ?? []);
export const getSearchSource = computed(
  () => systemConfig.value.searchSource ?? [],
);
export const getUrlMap = computed(() =>
  Object.fromEntries(
    getNavList.value
      .map((item) => item.data)
      .flat()
      .map((item) => [item.url, item]),
  ),
);
// 计数器
export const counter = ref(JSON.parse(localStorage.getItem("counter") ?? "{}"));
export const getCounter = computed(() => {
  return Object.entries(counter.value)
    .sort(([, valueA], [, valueB]) => valueB - valueA)
    .map(([url]) => getUrlMap.value[url])
    .filter((item) => item)
    .slice(0, settings.recommendCount);
});

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
