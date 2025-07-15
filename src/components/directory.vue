<template>
  <NLayoutSider
    id="directory"
    v-model:collapsed="collapsed"
    collapseMode="transform"
    :width="narrowScreen ? '100%' : 240"
    :collapsedWidth="0"
    :showTrigger="!narrowScreen"
    :position="narrowScreen ? 'absolute' : 'static'"
    bordered
  >
    <NFlex class="h-full overflow-hidden" vertical>
      <NCard size="small" :bordered="false" contentClass="p-3!">
        <div class="flex gap-4">
          <NButton
            v-if="narrowScreen && !collapsed"
            circle
            strong
            secondary
            type="tertiary"
            class="rounded!"
            @click="() => (collapsed = true)"
          >
            <template #icon>
              <KeyboardArrowLeftRound />
            </template>
          </NButton>
          <NButton
            id="searchButton"
            type="primary"
            @click="() => (searchDialogVisible = true)"
            class="flex-[1_0_160px] rounded!"
            tag="div"
          >
            <template #icon>
              <SearchOutlined />
            </template>
            {{ getLangData("搜索") }}
            {{ settings.useSearchShortcutKey ? "( CTRL+S )" : "" }}
          </NButton>
          <NButton
            id="settingButton"
            circle
            strong
            secondary
            type="tertiary"
            class="rounded!"
            @click="() => (settingDialogVisible = true)"
          >
            <template #icon>
              <SettingsSharp />
            </template>
          </NButton>
        </div>
      </NCard>
      <NMenu
        :options="getNavList"
        childrenField="data"
        keyField="label"
        :renderIcon="renderIcon"
        :renderLabel="renderLabel"
        :defaultExpandAll="settings.menuDefaultExpandAll"
        :watchProps="['defaultExpandedKeys']"
        class="flex-1 overflow-auto! scrollbar-none capitalize"
        v-if="getNavList?.length > 0"
      >
      </NMenu>
      <NFlex v-else justify="center" align="center" class="h-full">
        <NEmpty :description="getLangData('没有配置数据源或数据源无数据')">
          <template #extra>
            <NButton secondary @click="() => (settingDialogVisible = true)">{{
              getLangData("前往设置配置数据源")
            }}</NButton>
          </template>
        </NEmpty>
      </NFlex>
    </NFlex>
    <Search />
  </NLayoutSider>
</template>
<script setup>
import {
  getNavList,
  settings,
  settingDialogVisible,
  searchDialogVisible,
  counter,
  narrowScreen,
  collapsed,
} from "../stores.js";
import { defineAsyncComponent, h, hydrateOnIdle } from "vue";
import { NIcon, NImage } from "naive-ui";
import iconImage from "../assets/icon.png";
import {
  SearchOutlined,
  SettingsSharp,
  KeyboardArrowLeftRound,
} from "@vicons/material";
import { getLangData } from "../lang/index.js";
const Search = defineAsyncComponent({
  loader: () => import("./search.vue"),
  hydrate: hydrateOnIdle(),
});

const renderIcon = ({ iconURL, url }) =>
  iconURL || url
    ? h(NIcon, null, () =>
        h(NImage, {
          src: iconURL || `${url}/favicon.ico`,
          width: "100%",
          height: "100%",
          fallbackSrc: iconImage,
        }),
      )
    : null;

const renderLabel = ({ url, label }) => {
  if (url) {
    return h(
      "a",
      {
        href: url,
        target: settings.aElementTarget,
        onClick: () => {
          counter.value[url] = (counter.value[url] ?? 0) + 1;
        },
      },
      label,
    );
  } else {
    return label;
  }
};
</script>

<style scoped lang="stylus"></style>
