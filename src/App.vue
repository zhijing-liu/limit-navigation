<template>
  <NConfigProvider
    :theme="settings.darkTheme ? darkTheme : lightTheme"
    class="w-full"
    :themeOverrides="themeOverrides"
  >
    <NMessageProvider>
      <NGlobalStyle />
      <NSpin
        :show="loading"
        contentClass="w-full h-full"
        class="h-full w-full"
        :delay="300"
        size="small"
      >
        <NLayout hasSider class="h-full" v-if="!loading">
          <Directory />
          <Container />
        </NLayout>
      </NSpin>
      <Setting />
    </NMessageProvider>
  </NConfigProvider>
</template>
<script setup>
import { darkTheme, lightTheme } from "naive-ui";
import Directory from "./components/directory.vue";
import Container from "./components/container.vue";
import { settings } from "./stores.js";
import { watch, ref, defineAsyncComponent, hydrateOnIdle, computed } from "vue";
import { hexToHsla, loadConfig } from "./utils.js";
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
const Setting = defineAsyncComponent({
  loader: () => import("./components/setting.vue"),
  hydrate: hydrateOnIdle(),
});
const loading = ref(true);
watch(
  () => `${settings.loadDefaultConfig} ${settings.externalDataUrl}`,
  async () => {
    loading.value = true;
    const urls = [];
    if (settings.loadDefaultConfig) {
      urls.push("/systemConfig.json");
    }
    if (settings.externalDataUrl) {
      urls.push(settings.externalDataUrl);
    }
    await loadConfig(urls);
    loading.value = false;
  },
  {
    immediate: true,
  },
);
</script>
<style lang="stylus">
body
  padding 0
  margin 0
  width 100vw
  height 100vh
  #app
    height 100%
    width 100%
    overflow hidden
    display flex
@supports (height 100svh)
  body
    width 100svw
    height 100svh
</style>
