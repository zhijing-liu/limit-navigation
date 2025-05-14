import { ref, toRaw, watch } from "vue";

export const systemConfig = ref({ navList: [], searchSource: [] });

export const getNavList = computed(() => systemConfig.value.navList ?? []);
export const getSearchSource = computed(
  () => systemConfig.value.searchSource ?? [],
);
// 设置
export const settings = reactive({
  darkTheme: true,
  menuDefaultExpandAll: true,
  externalDataUrl: "",
  loadDefaultConfig: true,
  listScrollAdsorption: true,
  aElementTarget: "_blank",
  useSearchShortcutKey: true,
  lang: "zh-CHS",
  searchSource: "",
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
