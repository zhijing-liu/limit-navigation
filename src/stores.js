import { ref, toRaw, watch } from "vue";

export const systemConfig = ref({ navList: [] });

export const getNavList = computed(() => systemConfig.value.navList ?? []);

export const settings = reactive({
  darkTheme: true,
  menuDefaultExpandAll: true,
  externalDataUrl: "",
  loadDefaultConfig: true,
  listScrollAdsorption: true,
  aElementTarget: "_blank",
  useSearchShortcutKey: true,
  ...JSON.parse(localStorage.getItem("settings") ?? "{}"),
});
export const settingDialogVisible = ref(false);
watch(
  () => settings,
  () => {
    localStorage.setItem("settings", JSON.stringify(toRaw(settings)));
  },
  {
    deep: true,
  },
);
