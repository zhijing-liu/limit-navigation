<template>
  <NModal
    v-model:show="settingDialogVisible"
    preset="dialog"
    type="success"
    :title="getLangData('设置')"
    class="w-[550px]!"
    :positiveText="getLangData('完成')"
    :positiveButtonProps="{ type: 'primary' }"
    :closeOnEsc="false"
    :maskClosable="false"
    :showIcon="false"
  >
    <template #close>
      <NFlex>
        <NButton secondary size="small" @click="outputConfig" type="tertiary">{{
          getLangData("导出")
        }}</NButton>
        <NButton secondary size="small" @click="inputConfig" type="primary">{{
          getLangData("导入")
        }}</NButton>
      </NFlex>
    </template>
    <NFlex class="h-[60vh] overflow-auto" vertical>
      <NCard
        :title="`${getLangData('偏好')} :`"
        :bordered="false"
        size="small"
        headerClass="px-2!"
        contentClass="pb-0!"
      >
        <NList size="small">
          <NListItem>
            <NFlex justify="space-between">
              <span class="flex-1">{{ getLangData("默认展开菜单") }} :</span>
              <NSwitch
                v-model:value="settings.menuDefaultExpandAll"
                size="small"
              ></NSwitch>
            </NFlex>
          </NListItem>
          <NListItem>
            <NFlex justify="space-between">
              <span class="flex-1">{{ getLangData("列表滚动吸附") }} :</span>
              <NSwitch
                v-model:value="settings.listScrollAdsorption"
                size="small"
              ></NSwitch>
            </NFlex>
          </NListItem>
          <NListItem>
            <NFlex justify="space-between">
              <span class="flex-1">{{ getLangData("新页面打开方式") }} :</span>
              <NSelect
                class="flex-[0_0_200px]"
                v-model:value="settings.aElementTarget"
                size="small"
                :options="[
                  { label: getLangData('新页面打开'), value: '_blank' },
                  { label: getLangData('当前页打开'), value: '_self' },
                ]"
                :placeholder="getLangData('选择类型')"
              ></NSelect>
            </NFlex>
          </NListItem>
          <NListItem>
            <NFlex justify="space-between">
              <span class="flex-1">{{ getLangData("语言") }} :</span>
              <NSelect
                class="flex-[0_0_200px]"
                v-model:value="settings.lang"
                size="small"
                :options="settingOptions"
                :placeholder="getLangData('选择语言')"
              ></NSelect>
            </NFlex>
          </NListItem>
          <NListItem>
            <NFlex justify="space-between">
              <span class="flex-1"
                >{{ getLangData("是否启用搜索快捷键") }} :</span
              >
              <NSwitch
                v-model:value="settings.useSearchShortcutKey"
                size="small"
              ></NSwitch>
            </NFlex>
          </NListItem>
          <NListItem>
            <NFlex justify="space-between" class="gap-1!">
              <span class="flex-1"
                >{{ getLangData("热门地址展示数量") }} :</span
              >
              <NInputNumber
                size="small"
                class="w-[100px] text-center"
                v-model:value="settings.recommendCount"
                :min="0"
                :max="Object.keys(getUrlMap).length"
                buttonPlacement="both"
              ></NInputNumber>
              <NButton
                size="small"
                type="warning"
                circle
                strong
                secondary
                class="rounded!"
                @click="
                  () => {
                    counter = {};
                    message.success(getLangData('计数器已重置'));
                  }
                "
              >
                <template #icon>
                  <RefreshFilled />
                </template>
              </NButton>
            </NFlex>
          </NListItem>
        </NList>
      </NCard>
      <NCard
        :title="`${getLangData('主题')} :`"
        :bordered="false"
        size="small"
        headerClass="px-2!"
        contentClass="pb-0!"
      >
        <NList size="small">
          <NListItem>
            <NFlex justify="space-between">
              <span class="flex-1">{{ getLangData("深色模式") }} :</span>
              <NSwitch
                v-model:value="settings.darkTheme"
                size="small"
              ></NSwitch>
            </NFlex>
          </NListItem>
          <NListItem>
            <NFlex justify="space-between">
              <span class="flex-1">{{ getLangData("主题色") }} :</span>
              <NFlex class="flex-[0_0_190px] gap-3!" justify="center">
                <div
                  class="w-[28px] h-[28px] rounded cursor-pointer hover:scale-[1.3] duration-300 border-2 border-green-50"
                  v-for="color in themePrimaryColors"
                  :style="`background-color:${color};border-color:${hexToRgba(color, 0.3).value};`"
                  @click="() => (settings.primaryColor = color)"
                  :class="{ 'border-white!': settings.primaryColor === color }"
                ></div>
                <NColorPicker
                  v-model:value="settings.primaryColor"
                  :modes="['hex']"
                  size="small"
                  :showAlpha="false"
                />
              </NFlex>
            </NFlex>
          </NListItem>
        </NList>
      </NCard>
      <NCard
        :title="`${getLangData('配置')} :`"
        :bordered="false"
        size="small"
        headerClass="px-2!"
        contentClass="pb-0!"
      >
        <NList size="small">
          <NListItem>
            <NFlex justify="space-between" align="center">
              <span class="flex-1">{{ getLangData("外部配置项地址") }} :</span>
              <NFlex class="flex-1 flex-nowrap! gap-1!" justify="flex-end">
                <NInput
                  v-model:value="settings.externalDataUrl"
                  class="flex-[0_0_200px]"
                  :placeholder="`${getLangData('接口地址')} , ${getLangData('只支持GET请求')}`"
                  size="small"
                >
                </NInput>
                <NButton
                  @click="uploadSystemConfig"
                  circle
                  strong
                  secondary
                  type="primary"
                  class="rounded!"
                  size="small"
                >
                  <template #icon>
                    <UploadFileFilled />
                  </template>
                </NButton>
              </NFlex>
            </NFlex>
          </NListItem>
          <NListItem>
            <NFlex justify="space-between">
              <span class="flex-1">{{ getLangData("加载默认设置") }} :</span>
              <NSwitch
                v-model:value="settings.loadDefaultConfig"
                size="small"
              />
            </NFlex>
          </NListItem>
        </NList>
      </NCard>
    </NFlex>
  </NModal>
</template>
<script setup>
import { toRaw } from "vue";
import { UploadFileFilled, RefreshFilled } from "@vicons/material";
import {
  settings,
  settingDialogVisible,
  getUrlMap,
  themePrimaryColors,
  counter,
} from "../stores.js";
import { getLangData, settingOptions } from "../lang";
import { hexToRgba } from "../utils.js";
import { useMessage } from "naive-ui";
const message = useMessage();
const inputConfig = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "Application/json";
  input.addEventListener("change", () => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      const s = JSON.parse(reader.result.toString());
      for (const key in s) {
        settings[key] = s[key];
      }
    });
    reader.readAsText(input.files[0]);
  });
  input.click();
  input.remove();
};
const outputConfig = () => {
  const a = document.createElement("a");
  a.download = "config.json";
  const blob = new Blob([JSON.stringify(toRaw(settings))]);
  a.href = URL.createObjectURL(blob);
  a.click();
  a.remove();
};
const uploadSystemConfig = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "Application/json";
  input.addEventListener("change", () => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      settings.externalDataUrl = reader.result;
    });
    reader.readAsDataURL(input.files[0]);
  });
  input.click();
  input.remove();
};
</script>
<style scoped lang="stylus"></style>
