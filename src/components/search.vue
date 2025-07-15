<template>
  <NModal
    v-model:show="searchDialogVisible"
    preset="dialog"
    :title="getLangData('搜索')"
    class="w-[600px]!"
    :closeOnEsc="!searchActiveItem"
    :icon="() => h(ScreenSearchDesktopTwotone)"
  >
    <NFlex vertical class="overflow-hidden h-[60vh] py-2">
      <NInputGroup>
        <NDropdown
          v-if="settings.searchSource"
          labelField="label"
          keyField="url"
          :options="getSearchSource"
          :renderOption="searchIconRender"
          :showArrow="false"
          :showCheckmark="false"
          trigger="click"
        >
          <NButton type="primary" circle class="rounded!">
            <template #icon>
              <NIcon>
                <img :src="settings.searchSource.icon" alt="" />
              </NIcon>
            </template>
          </NButton>
        </NDropdown>
        <NInput
          v-model:value="searchValue"
          ref="searchInputIns"
          :placeholder="getLangData('输入搜索地址或搜索内容')"
          @keydown="searchKeyDown"
          @compositionstart="() => (isComposing = true)"
          @compositionend="() => (isComposing = false)"
          clearable
          @fucus="() => (inputIsFocus = true)"
          @blur="() => (inputIsFocus = false)"
        ></NInput>
        <NButton @click="arrive" :disabled="searchValueEmpty" type="primary">
          <template #icon>
            <NIcon>
              <ArrowForwardFilled v-if="searchValueIsUrl" />
              <SearchFilled v-else />
            </NIcon>
          </template>
        </NButton>
      </NInputGroup>
      <NList class="flex-1 overflow-auto">
        <NListItem
          v-for="(item, index) in searchResult"
          :key="item"
          class="p-0! leading-12"
          @click="
            () => {
              searchValue = '';
              searchDialogVisible = false;
            }
          "
        >
          <NFlex
            justify="space-between"
            align="center"
            :class="{ 'bg-teal-700/40': index === searchIndex }"
            class="px-2 rounded! hover:bg-gray-600/40 overflow-hidden mb-1"
          >
            <a
              :href="item.url"
              :target="settings.aElementTarget"
              class="flex-1 h-full inline-block px-2"
              :class="{ searchActive: index === searchIndex }"
              @click="
                () => {
                  counter[item.url] = (counter[item.url] ?? 0) + 1;
                  if (item.history) {
                    item.t = new Date().getTime();
                  }
                }
              "
              >{{ item.label }} - [ {{ item.des }} ]
            </a>
            <NButton
              circle
              strong
              secondary
              type="tertiary"
              class="rounded!"
              @click.stop="() => removeSearchHistory(item.label)"
              v-if="item.history"
            >
              <template #icon>
                <CloseOutlined />
              </template>
            </NButton>
          </NFlex>
        </NListItem>
      </NList>
    </NFlex>
    <NButton
      :disabled="!settings.useSearchHistory || getSearchHistory.length === 0"
      class="w-full!"
      type="primary"
      secondary
      @click="
        clearSearchHistory();
        message.success(getLangData('历史记录已重置'));
      "
      >{{ getLangData("清空搜索历史") }}</NButton
    >
  </NModal>
</template>
<script setup>
import {
  addSearchHistory,
  clearSearchHistory,
  counter,
  getSearchData,
  getSearchHistory,
  getSearchSource,
  removeSearchHistory,
  searchDialogVisible,
  settingDialogVisible,
  settings,
} from "../stores.js";
import {
  ArrowForwardFilled,
  SearchFilled,
  CloseOutlined,
  ScreenSearchDesktopTwotone,
} from "@vicons/material";
import { getLangData } from "../lang";
import { computed, h, watch } from "vue";
import { NButton, NIcon, useMessage } from "naive-ui";
import Fuse from "fuse.js";
import { match } from "pinyin-pro";

const message = useMessage();
const searchValue = ref("");
const searchValueTrim = computed(() => searchValue.value.trim());
const searchValueEmpty = computed(() => searchValueTrim.value.length === 0);
const searchInputIns = ref();
const searchIndex = ref(-1);
const searchActiveItem = ref(null);
const inputIsFocus = ref(false);
const isComposing = ref(false);
const urlReg =
  /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
const searchValueIsUrl = computed(() => urlReg.test(searchValueTrim.value));
const fuse = computed(
  () =>
    new Fuse(getSearchData.value, {
      threshold: settings.searchThreshold,
      ignoreLocation: true,
      keys: ["des", "url", "label"],
    }),
);
const pinyinMatchData = computed(() =>
  getSearchData.value.map((item) => ({
    item,
    value: `${item.url},${item.des},${item.label}`,
  })),
);

const searchResult = computed(() =>
  searchValueTrim.value.length > 0
    ? [
        ...new Set(
          [
            ...fuse.value.search(searchValueTrim.value),
            ...(settings.pinyinMatch
              ? pinyinMatchData.value.filter((item) =>
                  match(item.value, searchValue.value),
                )
              : []),
          ].map(({ item }) => item),
        ),
      ]
    : getSearchData.value,
);
watch(
  () => searchResult.value,
  () => {
    searchIndex.value = Math.min(
      searchResult.value.length - 1,
      Math.max(-1, searchIndex.value),
    );
  },
  {
    deep: true,
  },
);
const arrive = () => {
  let url;
  if (searchValueIsUrl.value) {
    url = searchValue.value;
    if (url.startsWith("//")) {
      url = "https:" + url;
    } else if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
  } else {
    url = settings.searchSource.url.replace(
      "{{data}}",
      searchValue.value.replaceAll(" ", "+"),
    );
  }
  addSearchHistory({
    label: searchValue.value,
    url,
    des: getLangData("搜索历史"),
    history: true,
  });
  window.open(url, settings.aElementTarget);
};
const inputChange = () => {
  if (searchActiveItem.value) {
    searchActiveItem.value?.click();
  } else if (!searchValueEmpty.value) {
    arrive();
  } else {
    return;
  }
  searchValue.value = "";
  searchDialogVisible.value = false;
};
const searchKeyDown = ({ key, code }) => {
  if (code === "ArrowDown") {
    searchIndex.value = Math.min(
      searchResult.value.length - 1,
      Math.max(-1, searchIndex.value + 1),
    );
  } else if (code === "ArrowUp") {
    searchIndex.value = Math.min(
      searchResult.value.length - 1,
      Math.max(-1, searchIndex.value - 1),
    );
  } else if (code === "PageUp" || code === "PageDown") {
    const index = getSearchSource.value.findIndex(
      ({ url }) => url === settings.searchSource.url,
    );
    if (code === "PageUp") {
      settings.searchSource = getSearchSource.value.at(Math.max(0, index - 1));
    } else if (code === "PageDown") {
      settings.searchSource = getSearchSource.value.at(
        Math.min(getSearchSource.value.length - 1, index + 1),
      );
    }
  } else if (code === "Enter" && !isComposing.value) {
    inputChange();
  }
};
const searchIconRender = ({ option }) =>
  h(
    "div",
    h(
      NButton,
      {
        circle: true,
        secondary: settings.searchSource.url !== option.url,
        class: "rounded! m-1! border-0!",
        strong: true,
        type: "primary",
        onClick: () => {
          settings.searchSource = option;
          searchInputIns.value.focus();
        },
      },
      {
        icon: () =>
          h(NIcon, {}, { default: () => h("img", { src: option.icon }) }),
      },
    ),
  );
watch(
  () => searchIndex.value,
  () => {
    searchActiveItem.value = document.querySelector("a.searchActive");
    searchActiveItem.value?.scrollIntoView({
      block: "center",
    });
  },
  {
    flush: "post",
  },
);
watch(
  () => searchDialogVisible.value,
  () => {
    if (searchDialogVisible.value) {
      if (!settings.searchSource) {
        settings.searchSource = getSearchSource.value.at(0);
      }
      nextTick(() => {
        searchInputIns.value.focus();
      });
    }
  },
);
window.addEventListener("keydown", (e) => {
  if (
    (e.ctrlKey && e.code === "KeyS") ||
    (e.code === "Space" && !searchDialogVisible.value)
  ) {
    e.stopPropagation();
    e.preventDefault();
  }
});
window.addEventListener("keyup", (e) => {
  if (
    ((e.ctrlKey && e.code === "KeyS") ||
      (e.code === "Space" && !searchDialogVisible.value)) &&
    settings.useSearchShortcutKey &&
    !settingDialogVisible.value
  ) {
    searchDialogVisible.value = true;
    e.stopPropagation();
    e.preventDefault();
  } else if (e.code === "Escape" && searchActiveItem.value) {
    searchIndex.value = -1;
    e.stopPropagation();
    e.preventDefault();
  } else if (searchDialogVisible.value && !inputIsFocus.value) {
    searchInputIns.value.focus();
  }
});
</script>
<style scoped lang="stylus"></style>
