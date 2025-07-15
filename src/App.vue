<template>
  <NSpin
    :show="loading"
    contentClass="w-full h-full"
    class="h-full w-full"
    :delay="100"
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
import { useMessage, useNotification, NButton, NFlex } from "naive-ui";
import Directory from "./components/directory.vue";
import Container from "./components/container.vue";
import {
  isNotFirst,
  narrowScreen,
  settings,
  systemConfig,
  userData,
} from "./stores.js";
import { watch, ref, defineAsyncComponent, hydrateOnIdle } from "vue";
import { hexToHsla, loadConfig } from "./utils.js";
import { getLangData } from "./lang/index.js";

const message = useMessage();
const notification = useNotification();
const Setting = defineAsyncComponent({
  loader: () => import("./components/setting.vue"),
  hydrate: hydrateOnIdle(),
});
const loading = ref(true);
const loadData = async () => {
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
};
watch(
  () => [settings.loadDefaultConfig, settings.externalData, userData],
  async () => {
    await loadData();
  },
  {
    deep: true,
  },
);
onMounted(async () => {
  await loadData();
  if (!isNotFirst.value && !narrowScreen.value) {
    nextTick(() => {
      const n = notification.create({
        title: getLangData("第一次使用?"),
        content: getLangData("需要我为你介绍导航的大致功能么?"),
        meta: `${getLangData("来自")} 纸境工作室`,
        action: () =>
          h(NFlex, {}, () => [
            h(
              NButton,
              {
                text: true,
                type: "primary",
                onClick: async () => {
                  const [{ driver }] = await Promise.all([
                    import("driver.js"),
                    import("driver.js/dist/driver.css"),
                    import("./style/driver.styl"),
                  ]);
                  driver({
                    showProgress: true,
                    popoverClass: "driverjs-theme",
                    disableActiveInteraction: true,
                    nextBtnText: getLangData("下一步"),
                    doneBtnText: getLangData("学会了！"),
                    showButtons: ["next"],
                    steps: [
                      {
                        element: "#container",
                        popover: {
                          title: getLangData("这是主体"),
                          description:
                            getLangData("这里将分类展示你所有的导航数据"),
                          side: "left",
                          align: "start",
                        },
                      },
                      {
                        element: ".navUnit:nth-child(1)",
                        popover: {
                          title: getLangData("点击路由"),
                          description:
                            getLangData("点击跳转，或者右键复制链接"),
                          side: "left",
                          align: "start",
                        },
                      },
                      {
                        element: "#directory",
                        popover: {
                          title: getLangData("这里是菜单"),
                          description: getLangData(
                            "这里也可以点击跳转，但大多数情况我还是希望做一个分类展示，你开心就好！",
                          ),
                          side: "left",
                          align: "start",
                        },
                      },
                      {
                        element: "#searchButton",
                        popover: {
                          title: getLangData("搜索在这儿！"),
                          description: getLangData(
                            "你要是觉得点起来很费劲就用快捷键吧！(其实空格也能打开)",
                          ),
                          side: "left",
                          align: "start",
                        },
                      },
                      {
                        element: "#settingButton",
                        popover: {
                          title: getLangData("设置在这儿！"),
                          description: getLangData(
                            "超多的设置项，但没有一个是多余的！！！",
                          ),
                          side: "left",
                          align: "start",
                        },
                      },
                    ],
                  }).drive();
                  localStorage.setItem("isNotFirst", "true");
                },
              },
              {
                default: () => getLangData("好"),
              },
            ),
            h(
              NButton,
              {
                text: true,
                type: "primary",
                onClick: () => {
                  localStorage.setItem("isNotFirst", "true");
                  n.destroy();
                },
              },
              {
                default: () => getLangData("再也不"),
              },
            ),
          ]),
      });
    });
  }
});
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
