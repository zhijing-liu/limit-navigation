<template>
  <NModal
    v-model:show="settingDialogVisible"
    preset="dialog"
    type="success"
    :title="getLangData('设置')"
    class="w-[550px]!"
    :positiveText="getLangData('完成')"
    :positiveButtonProps="{ type: 'primary' }"
    @positiveClick="submitSetting"
    :closeOnEsc="false"
    :maskClosable="false"
    :showIcon="false"
  >
    <template #close>
      <NFlex>
        <NButton size="small" @click="outputConfig">{{
          getLangData("导出")
        }}</NButton>
        <NButton size="small" @click="inputConfig" type="primary">{{
          getLangData("导入")
        }}</NButton>
      </NFlex>
    </template>
    <NFlex class="h-[60vh] overflow-auto" vertical>
      <NCard size="small" headerClass="px-2!" contentClass="pb-0!">
        <template #header>
          <NFlex align="center" class="gap-1!">
            <NIcon>
              <StyleSharp />
            </NIcon>
            <span>{{ getLangData("用户") }} :</span>
          </NFlex>
        </template>
        <template #header-extra>
          <NFlex>
            <NButton
              size="small"
              type="error"
              circle
              strong
              secondary
              class="rounded!"
              @click="
                () => {
                  userData.name = '';
                  userData.passwd = '';
                  temporaryUserData.name = '';
                  temporaryUserData.passwd = '';
                }
              "
            >
              <template #icon>
                <ExitToAppFilled />
              </template>
            </NButton>
          </NFlex>
        </template>
        <NList size="small">
          <NListItem>
            <NFlex justify="space-between">
              <span class="flex-1">{{ getLangData("用户名") }} :</span>
              <NInput
                v-model:value="temporaryUserData.name"
                size="small"
                class="flex-[0_0_200px]"
                placeholder="配置用户"
                :inputProps="{ autocomplete: 'off' }"
              ></NInput>
            </NFlex>
          </NListItem>
          <NListItem>
            <NFlex justify="space-between">
              <span class="flex-1">{{ getLangData("密码") }} :</span>
              <NInput
                v-model:value="temporaryUserData.passwd"
                size="small"
                type="password"
                class="flex-[0_0_200px]"
                placeholder="配置密码"
                :inputProps="{ autocomplete: 'off' }"
              ></NInput>
            </NFlex>
          </NListItem>
        </NList>
      </NCard>
      <NAlert :showIcon="false" :bordered="false">{{
        getLangData(
          "若您添加了用户信息 , 系统会自动从服务器自动同步您的配置,若希望修改您的配置，需前往配置管理器进行修改!",
        )
      }}</NAlert>
      <NCard size="small" headerClass="px-2!" contentClass="pb-0!">
        <template #header>
          <NFlex align="center" class="gap-1!">
            <NIcon>
              <StyleSharp />
            </NIcon>
            <span>{{ getLangData("偏好") }} :</span>
          </NFlex>
        </template>
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
      <NCard size="small" headerClass="px-2!" contentClass="pb-0!">
        <template #header>
          <NFlex align="center" class="gap-1!">
            <NIcon>
              <ColorLensFilled />
            </NIcon>
            <span>{{ getLangData("主题") }} :</span>
          </NFlex>
        </template>
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
      <NCard size="small" headerClass="px-2!" contentClass="pb-0!">
        <template #header>
          <NFlex align="center" class="gap-1!">
            <NIcon>
              <DataObjectFilled />
            </NIcon>
            <span>{{ getLangData("数据源配置") }} :</span>
          </NFlex>
        </template>
        <NList size="small">
          <NListItem>
            <NFlex
              justify="space-between"
              :align="narrowScreen ? 'flex-start' : 'center'"
              :vertical="narrowScreen"
            >
              <span class="flex-1">{{ getLangData("本机自定义配置") }} :</span>
              <NFlex class="flex-1 flex-nowrap! gap-1!" justify="flex-end">
                <NButton
                  @click="uploadSystemConfig"
                  strong
                  secondary
                  type="primary"
                  class="rounded!"
                  size="small"
                  v-if="settings.externalData === ''"
                >
                  {{ getLangData("上传") }}
                  <template #icon>
                    <UploadFileFilled />
                  </template>
                </NButton>
                <template v-else>
                  <a href="/reduce.html?default=externalData" target="_blank">
                    <NButton
                      strong
                      secondary
                      type="primary"
                      class="rounded!"
                      size="small"
                    >
                      {{ getLangData("编辑数据") }}
                      <template #icon>
                        <DriveFileRenameOutlineFilled />
                      </template>
                    </NButton>
                  </a>
                  <NButton
                    @click="() => (settings.externalData = '')"
                    strong
                    secondary
                    type="primary"
                    class="rounded!"
                    size="small"
                  >
                    {{ getLangData("删除") }}
                    <template #icon>
                      <UploadFileFilled />
                    </template>
                  </NButton>
                </template>
                <a href="/reduce.html" target="_blank">
                  <NButton strong type="primary" class="rounded!" size="small">
                    {{ getLangData("编辑器") }}
                    <template #icon>
                      <EditNoteFilled />
                    </template>
                  </NButton>
                </a>
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
      <NCard size="small" headerClass="px-2!" contentClass="pb-0!">
        <template #header>
          <NFlex align="center" class="gap-1!">
            <NIcon>
              <SearchOutlined />
            </NIcon>
            <span>{{ getLangData("搜索") }} :</span>
          </NFlex>
        </template>
        <NList size="small">
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
            <NFlex justify="space-between">
              <span class="flex-1"
                >{{ getLangData("是否启用拼音模糊检索") }} :</span
              >
              <NSwitch
                v-model:value="settings.pinyinMatch"
                size="small"
              ></NSwitch>
            </NFlex>
          </NListItem>
          <NListItem v-if="settings.pinyinMatch">
            <NFlex justify="space-between">
              <span class="flex-1"
                >{{ getLangData("是否启用更准确的拼音检索") }} :</span
              >
              <NSwitch
                :value="settings.pinyinPreciseDict"
                @updateValue="updatePinyinPreciseDict"
                size="small"
                :loading="loadPinyinPreciseDict"
              ></NSwitch>
            </NFlex>
          </NListItem>
          <NListItem>
            <NFlex justify="space-between" class="gap-1!">
              <span class="flex-1"
                >{{ getLangData("模糊搜索宽容度") }} - [0(
                {{ getLangData("严格") }} ) - 1( {{ getLangData("宽容") }} )]
                :</span
              >
              <NInputNumber
                size="small"
                class="w-[100px] text-center"
                v-model:value="settings.searchThreshold"
                :min="0"
                :max="1"
                :step="0.1"
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
                    settings.searchThreshold = 0.1;
                  }
                "
              >
                <template #icon>
                  <RefreshFilled />
                </template>
              </NButton>
            </NFlex>
          </NListItem>
          <NListItem>
            <NFlex justify="space-between">
              <span class="flex-1"
                >{{ getLangData("是否启用搜索历史") }} :</span
              >
              <NSwitch
                v-model:value="settings.useSearchHistory"
                size="small"
              ></NSwitch>
            </NFlex>
          </NListItem>
          <template v-if="settings.useSearchHistory">
            <NListItem>
              <NFlex justify="space-between">
                <span class="flex-1">{{ getLangData("搜索历史优先") }} :</span>
                <NSwitch
                  v-model:value="settings.searchHistoryPrecedence"
                  size="small"
                ></NSwitch>
              </NFlex>
            </NListItem>
            <NListItem>
              <NFlex justify="space-between" class="gap-1!">
                <span class="flex-1"
                  >{{ getLangData("保存搜索历史数量") }} :</span
                >
                <NInputNumber
                  size="small"
                  class="w-[100px] text-center"
                  v-model:value="settings.searchHistoryCount"
                  :min="0"
                  :max="1000"
                  :step="1"
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
                      clearSearchHistory();
                      message.success(getLangData('历史记录已重置'));
                    }
                  "
                >
                  <template #icon>
                    <RefreshFilled />
                  </template>
                </NButton>
              </NFlex>
            </NListItem>
          </template>
        </NList>
      </NCard>
    </NFlex>
  </NModal>
</template>
<script setup>
import { toRaw, nextTick } from "vue";
import {
  UploadFileFilled,
  RefreshFilled,
  StyleSharp,
  DataObjectFilled,
  ColorLensFilled,
  SearchOutlined,
  EditNoteFilled,
  DriveFileRenameOutlineFilled,
  ExitToAppFilled,
} from "@vicons/material";
import {
  settings,
  settingDialogVisible,
  getUrlMap,
  themePrimaryColors,
  counter,
  narrowScreen,
  clearSearchHistory,
  loadPinyinDicy,
  userData,
} from "../stores.js";
import { getLangData, settingOptions } from "../lang";
import { hexToRgba } from "../utils.js";
import { useMessage } from "naive-ui";
const temporaryUserData = reactive({
  name: userData.name,
  passwd: userData.passwd,
});
const message = useMessage();
const loadPinyinPreciseDict = ref(false);
const updatePinyinPreciseDict = (v) => {
  if (v) {
    loadPinyinPreciseDict.value = true;
    nextTick(() => {
      loadPinyinDicy()
        .then(() => {
          settings.pinyinPreciseDict = true;
        })
        .catch(() => {
          message.error(getLangData("加载字典失败"));
        })
        .finally(() => {
          loadPinyinPreciseDict.value = false;
        });
    });
  } else {
    settings.pinyinPreciseDict = false;
  }
};
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
      settings.externalData = reader.result;
    });
    reader.readAsText(input.files[0]);
  });
  input.click();
  input.remove();
};
const submitSetting = () => {
  userData.name = temporaryUserData.name;
  userData.passwd = temporaryUserData.passwd;
};
</script>
<style scoped lang="stylus"></style>
