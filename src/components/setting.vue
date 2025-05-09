<template>
  <NModal
    v-model:show="settingDialogVisible"
    preset="dialog"
    type="success"
    title="设置"
    class="w-[550px]!"
    positiveText="完成"
    :closeOnEsc="false"
    :maskClosable="false"
  >
    <template #close>
      <NFlex>
        <NButton secondary size="small" @click="outputConfig" type="tertiary"
          >导出</NButton
        >
        <NButton secondary size="small" @click="inputConfig" type="primary"
          >导入</NButton
        >
      </NFlex>
    </template>
    <NFlex class="h-[40vh] overflow-auto" vertical>
      <NCard
        title="样式与喜好 :"
        :bordered="false"
        size="small"
        headerClass="px-2!"
        contentClass="pb-0!"
      >
        <NList size="small">
          <NListItem>
            <NFlex justify="space-between">
              <span>深色模式 :</span>
              <NSwitch v-model:value="settings.darkTheme"></NSwitch>
            </NFlex>
          </NListItem>
          <NListItem>
            <NFlex justify="space-between">
              <span>默认展开菜单 :</span>
              <NSwitch v-model:value="settings.menuDefaultExpandAll"></NSwitch>
            </NFlex>
          </NListItem>
          <NListItem>
            <NFlex justify="space-between">
              <span>列表滚动吸附 :</span>
              <NSwitch v-model:value="settings.listScrollAdsorption"></NSwitch>
            </NFlex>
          </NListItem>
          <NListItem>
            <NFlex justify="space-between">
              <span>新页面打开方式 :</span>
              <NSelect
                class="flex-[0_0_150px]"
                v-model:value="settings.aElementTarget"
                size="small"
                :options="[
                  { label: '新页面打开', value: '_blank' },
                  { label: '当前页打开', value: '_self' },
                ]"
                placeholder="选择类型"
              ></NSelect>
            </NFlex>
          </NListItem>
          <NListItem>
            <NFlex justify="space-between">
              <span>是否启用搜索快捷键 :</span>
              <NSwitch v-model:value="settings.useSearchShortcutKey"></NSwitch>
            </NFlex>
          </NListItem>
        </NList>
      </NCard>
      <NCard
        title="配置 :"
        :bordered="false"
        size="small"
        headerClass="px-2!"
        contentClass="pb-0!"
      >
        <NList size="small">
          <NListItem>
            <NFlex justify="space-between" align="center">
              <span>外部配置项地址 :</span>
              <NFlex class="flex-1" justify="flex-end">
                <NInput
                  v-model:value="settings.externalDataUrl"
                  class="flex-[0_0_200px]"
                  placeholder="接口地址 , 只支持GET请求"
                >
                </NInput>
                <NButton
                  @click="uploadSystemConfig"
                  circle
                  strong
                  secondary
                  type="tertiary"
                  class="rounded!"
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
              <span>加载默认设置 :</span>
              <NSwitch v-model:value="settings.loadDefaultConfig"></NSwitch>
            </NFlex>
          </NListItem>
        </NList>
      </NCard>
    </NFlex>
  </NModal>
</template>
<script setup lang="ts">
import { reactive, ref, toRaw } from "vue";
import { UploadFileFilled } from "@vicons/material";
import { settings, settingDialogVisible } from "../stores.js";
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
