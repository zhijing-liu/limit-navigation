<template>
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
</template>
<script setup>
import { darkTheme, lightTheme, useMessage } from "naive-ui";
import Directory from "./components/directory.vue";
import Container from "./components/container.vue";
import { settings, systemConfig, userData } from "./stores.js";
import { watch, ref, defineAsyncComponent, hydrateOnIdle, computed } from "vue";
import { hexToHsla, loadConfig } from "./utils.js";
import { getLangData } from "./lang/index.js";
const message = useMessage();

const Setting = defineAsyncComponent({
  loader: () => import("./components/setting.vue"),
  hydrate: hydrateOnIdle(),
});
const loading = ref(true);
watch(
  () => [settings.loadDefaultConfig, settings.externalData, userData],
  async () => {
    loading.value = true;
    const urls = [];
    if (settings.loadDefaultConfig) {
      urls.push({
        url: "/systemConfig.json",
      });
    }
    if (userData.name) {
      const url = new URL("/api/getUserData.php", location.href);
      url.searchParams.set("name", userData.name);
      url.searchParams.set("passwd", userData.passwd);
      urls.push({
        url: url.toString(),
        success: ({ code, data }) => {
          if (code === 0) {
            message.success(
              `${userData.name.toUpperCase()} , ${getLangData("欢迎回来")} !`,
            );
            return JSON.parse(data);
          } else {
            throw Error();
          }
        },
        error: () => {
          message.warning(
            `${userData.name.toUpperCase()} , ${getLangData("没有找到配置项哦")} !`,
          );
        },
      });
    }
    // 加载本地存储数据
    let externalData;
    try {
      externalData = JSON.parse(settings.externalData);
    } catch {
      settings.externalData = "";
    }
    // 合并config
    const config = await loadConfig(urls);
    systemConfig.value = {
      navList: [...(config.navList ?? []), ...(externalData?.navList ?? [])],
      searchSource: [
        ...(config.searchSource ?? []),
        ...(externalData?.searchSource ?? []),
      ],
    };
    loading.value = false;
  },
  {
    immediate: true,
    deep: true,
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
