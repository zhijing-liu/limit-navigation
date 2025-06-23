<template>
  <NFlex class="h-full w-full bg-cyan-900/30" justify="center" align="center">
    <NCard class="w-auto! min-w-[600px]" title="设置配置项">
      <template #header-extra>
        <NFlex>
          <NButton
            circle
            size="small"
            class="rounded!"
            type="primary"
            @click="() => (addItemDialogVisible = true)"
          >
            <template #icon><AddFilled /></template>
          </NButton>
          <NButton
            circle
            size="small"
            class="rounded!"
            type="warning"
            @click="
              () => {
                systemConfig.navList = [];
                fileList = [];
              }
            "
          >
            <template #icon><RefreshFilled /></template>
          </NButton>
          <NButton
            circle
            size="small"
            class="rounded!"
            type="primary"
            @click="downloadConfig"
          >
            <template #icon><CloudDownloadFilled /></template>
          </NButton>
          <NButton
            circle
            size="small"
            class="rounded!"
            type="primary"
            @click="() => (uploadSystemConfigDialogVisible = true)"
          >
            <template #icon><CloudUploadFilled /></template>
          </NButton>
        </NFlex>
      </template>
      <NUpload
        v-if="getNavList.length === 0"
        v-model:fileList="fileList"
        :customRequest="loadCustomData"
      >
        <NUploadDragger v-if="fileList.length === 0">点击上传</NUploadDragger>
      </NUpload>
      <NList v-else class="max-h-[60vh] overflow-auto">
        <NListItem
          v-for="(item, index) in getNavList"
          :key="item.label"
          :attr-groupName.attr="index"
          class="listGroup"
        >
          <NCard
            :title="`${item.label} :`"
            size="small"
            :bordered="false"
            contentClass="px-2!"
          >
            <template #header-extra>
              <NFlex>
                <NButton
                  circle
                  size="small"
                  class="rounded!"
                  type="primary"
                  @click="
                    () => {
                      editItem = item;
                      addUnitDialogVisible = true;
                    }
                  "
                >
                  <template #icon><AddFilled /></template>
                </NButton>
                <NPopconfirm
                  @positiveClick="
                    () =>
                      (systemConfig.navList = systemConfig.navList.filter(
                        (i) => i.label !== item.label,
                      ))
                  "
                  negativeText="不了"
                  positiveText="是的"
                >
                  <template #trigger>
                    <NButton circle size="small" class="rounded!" type="error">
                      <template #icon><DeleteForeverTwotone /></template>
                    </NButton>
                  </template>
                  确定要删除当前分组？
                </NPopconfirm>
              </NFlex>
            </template>
            <NList>
              <ChildrenListItem
                v-for="unit in item.data"
                :key="unit.url"
                :unit="unit"
                :attr-itemName.attr="unit.url"
                @add="
                  () => {
                    addUnitFormData = { ...unit };
                    addUnitDialogVisible = true;
                  }
                "
                @delete="
                  () => (item.data = item.data.filter((u) => u !== unit))
                "
                @moveTo="moveTo"
              />
            </NList>
          </NCard>
        </NListItem>
      </NList>
      <template #action>
        <NButton
          @click="loadDefaultConfig"
          v-if="getNavList.length === 0"
          type="primary"
          >导入默认数据</NButton
        >
      </template>
    </NCard>
  </NFlex>
  <NModal
    v-model:show="addItemDialogVisible"
    preset="dialog"
    title="增加分类"
    @positiveClick="submitAddItem"
    positiveText="添加"
    contentClass="m-0!"
  >
    <NForm
      size="small"
      labelPlacement="left"
      labelWidth="80px"
      labelAlign="left"
      ref="addItemFormIns"
      :model="addItemFormData"
      :rules="addItemFormRules"
      class="pt-8"
    >
      <NFormItem label="名称 :" path="label">
        <NInput
          placeholder="输入分组名称"
          v-model:value="addItemFormData.label"
        ></NInput>
      </NFormItem>
    </NForm>
  </NModal>
  <NModal
    v-model:show="addUnitDialogVisible"
    preset="dialog"
    title="设置地址"
    @positiveClick="submitAddUnit"
    positiveText="保存"
    @close="addUnitDialogClose"
  >
    <NForm
      size="small"
      labelPlacement="left"
      labelWidth="80px"
      labelAlign="left"
      ref="addUnitFormIns"
      :model="addUnitFormData"
      :rules="addUnitFormRules"
      class="py-2"
    >
      <NFormItem
        :showLabel="false"
        v-if="addUnitFormData.iconURL || addUnitFormData.url"
      >
        <NFlex justify="center" class="w-full">
          <NImage
            :src="
              addUnitFormData.iconURL || `${addUnitFormData.url}/favicon.ico`
            "
            class="h-[80px]"
            ref="imageIns"
            :renderToolbar="renderImageToolbar"
          >
            <template #error>
              <n-icon :size="80" color="lightGrey">
                <BrokenImageOutlined />
              </n-icon>
            </template>
          </NImage>
        </NFlex>
      </NFormItem>
      <NFormItem label="名称 :" path="label">
        <NInput
          placeholder="输入名称"
          v-model:value="addUnitFormData.label"
        ></NInput>
      </NFormItem>
      <NFormItem label="描述 :" path="des">
        <NInput
          placeholder="输入描述"
          v-model:value="addUnitFormData.des"
        ></NInput>
      </NFormItem>
      <NFormItem label="地址 :" path="url">
        <NInput
          placeholder="输入地址"
          v-model:value="addUnitFormData.url"
        ></NInput>
      </NFormItem>
      <NFormItem label="图标 :">
        <NFlex :wrap="false" class="w-full">
          <NInput
            placeholder="输入地址"
            v-model:value="addUnitFormData.iconURL"
            class="flex-1"
            clearable
          ></NInput>
          <NButton size="small" type="primary" @click="uploadIcon"
            >上传文件</NButton
          >
        </NFlex>
      </NFormItem>
    </NForm>
  </NModal>
  <NModal
    v-model:show="uploadSystemConfigDialogVisible"
    preset="dialog"
    title="上传配置到服务器"
    @positiveClick="submitUploadSystemConfig"
    positiveText="开始上传"
    :positiveButtonProps="{ loading: uploadSystemConfigLoading }"
  >
    <NForm
      size="small"
      labelPlacement="left"
      labelWidth="80px"
      labelAlign="left"
      ref="addUnitFormIns"
      class="py-2"
      :disabled="uploadSystemConfigLoading"
    >
      <NFormItem label="用户名 :" path="label">
        <NInput
          placeholder="输入用户名"
          v-model:value="temporaryUserData.name"
          :inputProps="{ autocomplete: 'off' }"
        ></NInput>
      </NFormItem>
      <NFormItem label="密码 :" path="label">
        <NInput
          placeholder="输入密码"
          v-model:value="temporaryUserData.passwd"
          type="password"
          :inputProps="{ autocomplete: 'off' }"
        ></NInput>
      </NFormItem>
    </NForm>
  </NModal>
</template>
<script setup>
import { getNavList, settings, systemConfig, userData } from "../stores.js";
import { darkTheme, lightTheme, NButton, useMessage } from "naive-ui";
import { computed, ref, reactive, toRaw, h } from "vue";
import { hexToHsla, loadConfig } from "../utils.js";
import ChildrenListItem from "./childrenListItem.vue";
import {
  EditFilled,
  AddFilled,
  BrokenImageOutlined,
  CloudDownloadFilled,
  CloudUploadFilled,
  DeleteForeverTwotone,
  RefreshFilled,
  DragIndicatorFilled,
} from "@vicons/material";
import { dragItem } from "./store.js";
const message = useMessage();
const temporaryUserData = reactive({
  name: userData.name,
  passwd: userData.passwd,
});
const uploadSystemConfigDialogVisible = ref(false);
const uploadSystemConfigLoading = ref(false);
const submitUploadSystemConfig = async () => {
  const url = new URL("/api/uploadUserData.php", location.href);
  url.searchParams.set("name", temporaryUserData.name);
  url.searchParams.set("passwd", temporaryUserData.passwd);
  uploadSystemConfigLoading.value = true;
  return await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      data: JSON.stringify(toRaw(systemConfig.value)),
    }),
  })
    .then((r) => r.json())
    .then(({ code }) => {
      if (code === 0) {
        message.success("更新服务器成功 !");
      } else {
        throw Error();
      }
      return true;
    })
    .catch(() => {
      message.error("更新服务器失败 , 请检查 !");
      return false;
    })
    .finally(() => {
      uploadSystemConfigLoading.value = false;
    });
};
const addItemDialogVisible = ref(false);
const addItemFormIns = ref();
const addItemFormData = ref({
  label: "",
});
const addItemFormRules = {
  label: [
    {
      validator: (rule, value) => {
        if (value === "") {
          return new Error("分组名称是必须的");
        }
        return getNavList.value.find(({ label }) => label === value)
          ? new Error("已存在同名分组")
          : true;
      },
      trigger: ["input", "blur"],
    },
  ],
};
const imageIns = ref();
const renderImageToolbar = ({ nodes: { close } }) => [
  h(
    NButton,
    {
      type: "primary",
      style: { marginLeft: "12px" },
      onClick: () => {
        addUnitFormData.value.iconURL = imageIns.value.imageRef.currentSrc;
        message.info("已将图片地址存为本地资源");
      },
    },
    {
      default: () => "设置图片为本地链接",
    },
  ),
  h(
    NButton,
    {
      type: "error",
      style: { marginLeft: "12px" },
      ...close.props,
    },
    {
      default: () => "关闭",
    },
  ),
];
const editItem = ref();
const addUnitDialogVisible = ref(false);
const addUnitFormIns = ref();
const addUnitFormData = ref({
  label: "",
  url: "",
  des: "",
  iconURL: "",
});
const addUnitFormRules = {
  label: {
    required: true,
    message: "名称是必须的",
    trigger: ["input", "blur"],
  },
  url: {
    required: true,
    message: "地址是必须的",
    trigger: ["input", "blur"],
  },
  des: {
    required: true,
    message: "描述是必须的",
    trigger: ["input", "blur"],
  },
};
const addUnitDialogClose = () => {
  editItem.value = undefined;
  addUnitFormData.value = {
    label: "",
    url: "",
    des: "",
    iconURL: "",
  };
};
const submitAddItem = async () => {
  await addItemFormIns.value.validate();
  systemConfig.value.navList.push({
    label: addItemFormData.value.label,
    data: [],
  });
};
const submitAddUnit = async () => {
  await addUnitFormIns.value.validate();
  editItem.value?.data?.push({
    ...addUnitFormData.value,
  });
};
const uploadIcon = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", () => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      addUnitFormData.value.iconURL = reader.result;
    });
    reader.readAsDataURL(input.files[0]);
  });
  input.click();
  input.remove();
};
const themeOverrides = computed(() => {
  const { h, s, l } = hexToHsla(settings.primaryColor);
  return {
    common: {
      primaryColor: settings.primaryColor,
      primaryColorHover: `hsl(${h},${s}%,${Math.max(l, l + 10)}%)`,
      primaryColorPressed: `hsl(${h},${s}%,${Math.min(l, l - 5)}%)`,
      primaryColorSuppl: `hsl(${h},${s}%,${Math.max(l, l + 20)}%)`,
    },
  };
});
const loadDefaultConfig = () => {
  loadConfig([
    {
      url: "/systemConfig.json",
    },
  ]).then((data) => {
    systemConfig.value = data;
  });
};
const downloadConfig = () => {
  const a = document.createElement("a");
  a.download = "systemConfig.json";
  const blob = new Blob([JSON.stringify(toRaw(systemConfig.value), null, 2)]);
  a.href = URL.createObjectURL(blob);
  a.click();
  a.remove();
};
const fileList = ref([]);
const loadCustomData = async ({ file: { file }, onError }) => {
  try {
    systemConfig.value.navList = JSON.parse(await file.text()).navList ?? [];
  } catch (err) {
    console.log(err);
    onError();
  }
};
const defaultDataType = new URL(location).searchParams.get("default");

if (defaultDataType === "externalData") {
  try {
    systemConfig.value = JSON.parse(settings.externalData);
  } catch {
    message.error("加载设置数据失败");
  }
} else if (defaultDataType === "default") {
  loadDefaultConfig();
}
const moveTo = (index, childIndex, item) => {
  systemConfig.value.navList[index].data.splice(childIndex, 0, item);
};
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
