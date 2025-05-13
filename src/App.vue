<template>
  <NConfigProvider
    :theme="settings.darkTheme ? darkTheme : lightTheme"
    class="w-full"
  >
    <NGlobalStyle />
    <NSpin
      :show="loading"
      contentClass="w-full h-full"
      class="h-full w-full"
      :delay="300"
      size="small"
    >
      <NLayout hasSider class="h-full">
        <Directory />
        <Container />
      </NLayout>
    </NSpin>
    <Setting />
  </NConfigProvider>
</template>
<script setup>
import { darkTheme, lightTheme } from "naive-ui";
import Directory from "./components/directory.vue";
import Container from "./components/container.vue";
import { systemConfig, settings } from "./stores.js";
import { watch, ref, defineAsyncComponent, hydrateOnIdle } from "vue";
const Setting = defineAsyncComponent({
  loader: () => import("./components/setting.vue"),
  hydrate: hydrateOnIdle(),
});
const loading = ref(true);
watch(
  () => `${settings.loadDefaultConfig} ${settings.externalDataUrl}`,
  async () => {
    loading.value = true;
    const data = (
      await Promise.allSettled([
        settings.loadDefaultConfig
          ? fetch(`/systemConfig.json?t=${new Date().getTime()}`, {
              method: "GET",
            }).then((res) => res.json())
          : [],
        settings.externalDataUrl
          ? fetch(settings.externalDataUrl, {
              method: "GET",
            })
              .then((r) => r.json())
              .catch(() => ({}))
          : {},
      ])
    )
      .filter((item) => item.status === "fulfilled")
      .map((item) => item.value);
    const navList = data.map((item) => item.navList ?? []).flat();
    for (const item of data) {
      systemConfig.value = {
        ...systemConfig.value,
        ...item,
      };
    }
    systemConfig.value = {
      ...systemConfig.value,
      navList,
    };
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
  width 100svw
  height 100svh

  #app
    height 100%
    width 100%
    overflow hidden
    display flex
</style>
