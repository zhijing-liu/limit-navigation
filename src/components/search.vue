<template>
  <NModal
    v-model:show="searchDialogVisible"
    preset="dialog"
    :title="getLangData('搜索')"
    class="w-[600px]!"
    :closeOnEsc="!searchActiveItem"
    :showIcon="false"
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
          :class="{ 'bg-teal-900': index === searchIndex }"
          @click="
            () => {
              searchValue = '';
              searchDialogVisible = false;
            }
          "
        >
          <a
            :href="item.url"
            :target="settings.aElementTarget"
            class="w-full h-full inline-block px-2 hover:bg-gray-700 rounded"
            :class="{ searchActive: index === searchIndex }"
            @click="() => (counter[item.url] = (counter[item.url] ?? 0) + 1)"
            >{{ item.label }} - [ {{ item.des }} ]
          </a>
        </NListItem>
      </NList>
    </NFlex>
  </NModal>
</template>
<script setup>
import {
  counter,
  getNavList,
  getSearchSource,
  getUrlMap,
  searchDialogVisible,
  settings,
} from "../stores.js";
import { ArrowForwardFilled, SearchFilled } from "@vicons/material";
import { getLangData } from "../lang";
import { computed, h, watch } from "vue";
import { NButton, NIcon } from "naive-ui";
import Fuse from "fuse.js";

const searchValue = ref("");
const searchValueTrim = computed(() => searchValue.value.trim());
const searchValueEmpty = computed(() => searchValueTrim.value.length === 0);
const searchInputIns = ref();
const searchIndex = ref(-1);
const searchActiveItem = ref(null);
const inputIsFocus = ref(false);

const urlReg =
  /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
const searchValueIsUrl = computed(() => urlReg.test(searchValueTrim.value));

const fuse = computed(
  () =>
    new Fuse(Object.values(getUrlMap.value), {
      threshold: settings.searchThreshold,
      ignoreLocation: true,
      keys: ["des", "url", "label"],
    }),
);
const searchResult = computed(() =>
  searchValueTrim.value.length > 0
    ? fuse.value.search(searchValueTrim.value).map(({ item }) => item)
    : Object.values(getUrlMap.value),
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
  if (searchValueIsUrl.value) {
    let url = searchValue.value;
    if (url.startsWith("//")) {
      url = "https:" + url;
    } else if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    window.open(url, settings.aElementTarget);
  } else {
    window.open(
      settings.searchSource.url.replace(
        "{{data}}",
        searchValue.value.replaceAll(" ", "+"),
      ),
      settings.aElementTarget,
    );
  }
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
  } else if (code === "Enter") {
    if (searchActiveItem.value) {
      searchActiveItem.value?.click();
    } else if (!searchValueEmpty.value) {
      arrive();
    } else {
      return;
    }
    searchValue.value = "";
    searchDialogVisible.value = false;
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
  }
};
const searchIconRender = ({ option }) =>
  h(
    "div",
    h(
      NButton,
      {
        circle: true,
        class: "rounded! m-1! border-0!",
        type: settings.searchSource.url === option.url ? "primary" : "default",
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
  if (e.ctrlKey && e.key === "s") {
    e.stopPropagation();
    e.preventDefault();
  }
});
window.addEventListener("keyup", (e) => {
  if (e.ctrlKey && e.code === "KeyS" && settings.useSearchShortcutKey) {
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
