<template>
  <NLayoutSider
    v-model:collapsed="collapsed"
    collapseMode="transform"
    :width="narrowScreen ? '100%' : 240"
    :collapsedWidth="0"
    :showTrigger="narrowScreen && !collapsed ? false : 'arrow-circle'"
    :position="narrowScreen ? 'absolute' : 'static'"
    bordered
  >
    <NFlex class="h-full overflow-hidden" vertical>
      <NCard size="small" :bordered="false">
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
            secondary
            type="primary"
            @click="() => (searchDialogVisible = true)"
            class="flex-1 rounded!"
          >
            <template #icon>
              <SearchOutlined />
            </template>
            搜索 {{ settings.useSearchShortcutKey ? "( CTRL+S )" : "" }}
          </NButton>
          <NButton
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
      >
      </NMenu>
    </NFlex>
    <NModal
      v-model:show="searchDialogVisible"
      preset="dialog"
      type="success"
      title="搜索地址"
      class="w-[600px]!"
    >
      <NFlex vertical class="overflow-hidden h-[40vh] py-2">
        <NInput
          v-model:value="searchValue"
          ref="searchInputIns"
          placeholder="搜索地址"
          @keydown="searchKeyDown"
        ></NInput>
        <NList class="flex-1 overflow-auto">
          <NListItem
            v-for="(item, index) in searchResult"
            :key="item"
            class="p-0! leading-12"
            :class="{ 'bg-teal-900': index === searchIndex }"
          >
            <a
              :ref="(ins) => index === searchIndex && (searchActiveItem = ins)"
              :href="item.url"
              target="_blank"
              class="w-full h-full inline-block px-2 hover:bg-gray-700 rounded"
              >{{ item.label }} - [ {{ item.des }} ]
            </a>
          </NListItem>
        </NList>
      </NFlex>
    </NModal>
  </NLayoutSider>
</template>
<script setup>
import { getNavList, settings, settingDialogVisible } from "../stores.js";
import { computed, h, toRaw, watch } from "vue";
import { NIcon, NImage } from "naive-ui";
import iconImage from "../assets/icon.png";
import {
  SearchOutlined,
  SettingsSharp,
  KeyboardArrowLeftRound,
  UploadFileFilled,
} from "@vicons/material";

const narrowScreen = ref(document.body.clientWidth < 600);
const collapsed = ref(narrowScreen.value);
const searchDialogVisible = ref(false);
const searchValue = ref("");
const searchInputIns = ref();
const searchIndex = ref(-1);
const searchActiveItem = ref();
const childrenItemsText = computed(() =>
  getNavList.value
    .map((item) => item.data)
    .flat()
    .map((item) => JSON.stringify(item)),
);
const searchResult = computed(() => {
  const reg = new RegExp(`${searchValue.value.trim()}`, "g");
  const list = childrenItemsText.value
    .filter((item) => reg.test(item))
    .map((item) => JSON.parse(item));
  searchIndex.value = Math.min(
    list.length - 1,
    Math.max(-1, searchIndex.value),
  );
  return list;
});
const searchKeyDown = ({ key }) => {
  if (key === "ArrowDown") {
    searchIndex.value = Math.min(
      searchResult.value.length - 1,
      Math.max(-1, searchIndex.value + 1),
    );
  } else if (key === "ArrowUp") {
    searchIndex.value = Math.min(
      searchResult.value.length - 1,
      Math.max(-1, searchIndex.value - 1),
    );
  } else if (key === "Enter") {
    searchActiveItem.value?.click();
  }
};
watch(
  () => searchActiveItem.value,
  () => {
    searchActiveItem.value?.scrollIntoView({
      block: "center",
    });
  },
);
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
    return h("a", { href: url, target: settings.aElementTarget }, label);
  } else {
    return label;
  }
};
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "s" && settings.useSearchShortcutKey) {
    searchDialogVisible.value = true;
    nextTick(() => {
      searchInputIns.value.focus();
    });
    e.stopPropagation();
    e.preventDefault();
  }
});
</script>

<style scoped lang="stylus"></style>
