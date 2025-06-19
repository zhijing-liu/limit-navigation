import { h } from "vue";
import {
  darkTheme,
  lightTheme,
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
} from "naive-ui";
import { settings } from "./stores.js";
import { hexToHsla } from "./utils.js";

const themeOverrides = computed(() => {
  const { h, s, l } = hexToHsla(settings.primaryColor);
  return {
    common: {
      primaryColor: settings.primaryColor,
      primaryColorHover: `hsl(${h},${s}%,${Math.max(l, l + 10)}%)`,
      primaryColorPressed: `hsl(${h},${s}%,${Math.min(l, l - 5)}%)`,
      primaryColorSuppl: `hsl(${h},${s}%,${Math.max(l, l + 20)}%)`,
    },
  };
});
export const getGlobal = (App) => ({
  render: () =>
    h(
      NConfigProvider,
      {
        theme: settings.darkTheme ? darkTheme : lightTheme,
        class: "w-full",
        themeOverrides,
      },
      () => [h(NMessageProvider, {}, () => [h(App)]), h(NGlobalStyle)],
    ),
});
