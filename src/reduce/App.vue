<template>
  <NFlex class="h-full w-full bg-cyan-900/30" justify="center" align="center">
    <NCard class="w-auto! min-w-[400px]" :title="getLangData('设置配置项')">
      <template #header-extra>
        <NFlex>
          <NPopover trigger="hover" :delay="500" :show-arrow="false">
            <template #trigger>
              <NButton
                circle
                size="small"
                class="rounded!"
                type="primary"
                @click="() => setDefaultSystemConfig()"
              >
                <template #icon><CleaningServicesOutlined /></template>
              </NButton>
            </template>
            <span>{{ getLangData("初始化空数据") }}</span>
          </NPopover>
          <NPopover trigger="hover" :delay="500" :show-arrow="false">
            <template #trigger>
              <NButton
                circle
                size="small"
                class="rounded!"
                type="tertiary"
                @click="
                  () => {
                    updateDefaultSystemConfigDialogVisible = true;
                  }
                "
              >
                <template #icon><PasswordFilled /></template>
              </NButton>
            </template>
            <span>{{ getLangData("覆盖默认数据") }}</span>
          </NPopover>
          <NPopover trigger="hover" :delay="500" :show-arrow="false">
            <template #trigger>
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
            </template>
            <span>{{ getLangData("重置") }}</span>
          </NPopover>
          <NPopover trigger="hover" :delay="500" :show-arrow="false">
            <template #trigger>
              <NButton
                circle
                size="small"
                class="rounded!"
                type="primary"
                @click="downloadConfig"
              >
                <template #icon><CloudDownloadFilled /></template>
              </NButton>
            </template>
            <span>{{ getLangData("下载配置") }}</span>
          </NPopover>
          <NPopover trigger="hover" :delay="500" :show-arrow="false">
            <template #trigger>
              <NButton
                circle
                size="small"
                class="rounded!"
                type="primary"
                @click="() => (uploadSystemConfigDialogVisible = true)"
              >
                <template #icon><CloudUploadFilled /></template>
              </NButton>
            </template>
            <span>{{ getLangData("备份到服务器") }}</span>
          </NPopover>
        </NFlex>
      </template>
      <NUpload
        v-if="getNavList.length === 0"
        v-model:fileList="fileList"
        :customRequest="loadCustomData"
      >
        <NUploadDragger v-if="fileList.length === 0">{{
          getLangData("点击上传")
        }}</NUploadDragger>
      </NUpload>
      <NCollapse
        v-else
        accordion
        :defaultExpandedNames="['navList']"
        :triggerAreas="['main', 'arrow']"
      >
        <NCollapseItem :title="getLangData('地址配置项')" name="navList">
          <template #header-extra>
            <NFlex>
              <NButton
                size="small"
                class="rounded!"
                type="primary"
                @click="() => (addItemDialogVisible = true)"
              >
                <template #icon><AddFilled /></template>
                {{ getLangData("增加地址配置项") }}
              </NButton>
            </NFlex>
          </template>
          <NList class="max-h-[60vh] overflow-auto">
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
                      :negativeText="getLangData('不了')"
                      :positiveText="getLangData('是的')"
                    >
                      <template #trigger>
                        <NButton
                          circle
                          size="small"
                          class="rounded!"
                          type="error"
                        >
                          <template #icon><DeleteForeverTwotone /></template>
                        </NButton>
                      </template>
                      {{ getLangData("确定要删除当前分组？") }}
                    </NPopconfirm>
                  </NFlex>
                </template>
                <NList>
                  <ChildrenListItem
                    v-for="(unit, index) in item.data"
                    :key="unit.url"
                    :unit="unit"
                    :attr-itemName.attr="unit.url"
                    @edit="
                      () => {
                        editItem = item;
                        editUnitIndex = index;
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
        </NCollapseItem>
        <NCollapseItem :title="getLangData('搜索栏配置项')" name="searchSource">
          <template #header-extra>
            <NFlex>
              <NButton
                size="small"
                class="rounded!"
                type="primary"
                @click="
                  () => {
                    addSearchSourceItemIndex = -1;
                    addSearchSourceFormData = {
                      label: '',
                      icon: '',
                      url: '',
                    };
                    addSearchSourceDialogVisible = true;
                  }
                "
              >
                <template #icon><AddFilled /></template>
                {{ getLangData("增加搜索栏配置项") }}
              </NButton>
            </NFlex>
          </template>
          <NList class="max-h-[60vh] overflow-auto">
            <NListItem
              v-for="(item, index) in getSearchSource"
              :key="item.url"
              class="hover:bg-gray-600/40 rounded px-2! cursor-pointer py-2! bg-gray-300/20 mb-1"
            >
              <NFlex align="center" class="w-[600px]">
                <NIcon size="22">
                  <img :src="item.icon" alt="" />
                </NIcon>
                <span class="flex-1">{{ item.label }}</span>
                <NFlex align="center">
                  <NButton
                    circle
                    size="small"
                    class="rounded!"
                    type="primary"
                    :disabled="index === 0"
                    @click="() => setSearchSourceIndex(index, index - 1)"
                  >
                    <template #icon><ArrowUpwardOutlined /></template>
                  </NButton>
                  <NButton
                    circle
                    size="small"
                    class="rounded!"
                    type="primary"
                    :disabled="index === getSearchSource.length - 1"
                    @click="() => setSearchSourceIndex(index, index + 1)"
                  >
                    <template #icon><ArrowDownwardOutlined /></template>
                  </NButton>
                  <NButton
                    circle
                    size="small"
                    class="rounded!"
                    type="primary"
                    @click="
                      () => {
                        addSearchSourceItemIndex = index;
                        addSearchSourceFormData = { ...item };
                        addSearchSourceDialogVisible = true;
                      }
                    "
                  >
                    <template #icon><EditFilled /></template>
                  </NButton>
                  <NPopconfirm
                    @positiveClick="() => removeSearchSource(index)"
                    :negativeText="getLangData('不了')"
                    :positiveText="getLangData('是的')"
                  >
                    <template #trigger>
                      <NButton
                        circle
                        size="small"
                        class="rounded!"
                        type="error"
                      >
                        <template #icon><DeleteForeverTwotone /></template>
                      </NButton>
                    </template>
                    {{ getLangData("确定要删除当前地址？") }}
                  </NPopconfirm>
                </NFlex>
              </NFlex>
            </NListItem>
          </NList>
        </NCollapseItem>
      </NCollapse>
      <template #action>
        <NButton
          @click="loadDefaultConfig"
          v-if="getNavList.length === 0"
          type="primary"
          :loading="loadDefaultConfigLoading"
          >{{ getLangData("导入默认数据") }}</NButton
        >
      </template>
    </NCard>
  </NFlex>
  <NModal
    v-model:show="addItemDialogVisible"
    preset="dialog"
    :title="getLangData('增加分类')"
    @positiveClick="submitAddItem"
    :positiveText="getLangData('添加')"
    contentClass="m-0!"
  >
    <NForm
      size="small"
      labelPlacement="left"
      labelWidth="100px"
      labelAlign="left"
      ref="addItemFormIns"
      :model="addItemFormData"
      :rules="addItemFormRules"
      class="pt-8"
    >
      <NFormItem :label="`${getLangData('名称')} :`" path="label">
        <NInput
          :placeholder="getLangData('输入分组名称')"
          v-model:value="addItemFormData.label"
        ></NInput>
      </NFormItem>
    </NForm>
  </NModal>
  <NModal
    v-model:show="addUnitDialogVisible"
    preset="dialog"
    :title="getLangData('设置地址')"
    @positiveClick="submitAddUnit"
    :positiveText="getLangData('保存')"
    @close="addUnitDialogClose"
  >
    <NForm
      size="small"
      labelPlacement="left"
      labelWidth="100px"
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
      <NFormItem :label="`${getLangData('名称')} :`" path="label">
        <NInput
          :placeholder="getLangData('输入名称')"
          v-model:value="addUnitFormData.label"
        ></NInput>
      </NFormItem>
      <NFormItem :label="`${getLangData('描述')} :`" path="des">
        <NInput
          :placeholder="getLangData('输入描述')"
          v-model:value="addUnitFormData.des"
        ></NInput>
      </NFormItem>
      <NFormItem :label="`${getLangData('地址')} :`" path="url">
        <NInput
          :placeholder="getLangData('输入地址')"
          v-model:value="addUnitFormData.url"
        ></NInput>
      </NFormItem>
      <NFormItem :label="`${getLangData('图标')} :`">
        <NFlex :wrap="false" class="w-full">
          <NInput
            :placeholder="getLangData('输入地址')"
            v-model:value="addUnitFormData.iconURL"
            class="flex-1"
            clearable
          ></NInput>
          <NButton size="small" type="primary" @click="uploadIcon">{{
            getLangData("上传文件")
          }}</NButton>
        </NFlex>
      </NFormItem>
    </NForm>
  </NModal>
  <NModal
    v-model:show="uploadSystemConfigDialogVisible"
    preset="dialog"
    :title="getLangData('上传配置到服务器')"
    @positiveClick="submitUploadSystemConfig"
    :positiveText="getLangData('开始上传')"
    :positiveButtonProps="{ loading: uploadSystemConfigLoading }"
  >
    <NForm
      size="small"
      labelPlacement="left"
      labelWidth="100px"
      labelAlign="left"
      ref="addUnitFormIns"
      class="py-2"
      :disabled="uploadSystemConfigLoading"
    >
      <NFormItem :label="`${getLangData('用户名')} :`" path="label">
        <NInput
          :placeholder="getLangData('输入用户名')"
          v-model:value="temporaryUserData.name"
          :inputProps="{ autocomplete: 'off' }"
        ></NInput>
      </NFormItem>
      <NFormItem :label="`${getLangData('密码')} :`" path="label">
        <NInput
          :placeholder="getLangData('输入密码')"
          v-model:value="temporaryUserData.passwd"
          type="password"
          :inputProps="{ autocomplete: 'off' }"
        ></NInput>
      </NFormItem>
    </NForm>
  </NModal>
  <NModal
    v-model:show="addSearchSourceDialogVisible"
    preset="dialog"
    :title="getLangData('设置搜索栏配置项')"
    @positiveClick="submitAddSearchSource"
    :positiveText="getLangData('保存')"
    @close="
      () => {
        addSearchSourceItemIndex = -1;
      }
    "
  >
    <NForm
      size="small"
      labelPlacement="left"
      labelWidth="100px"
      labelAlign="left"
      ref="addSearchSourceFormIns"
      :model="addSearchSourceFormData"
      :rules="addSearchSourceFormRules"
      class="py-2"
    >
      <NFormItem :showLabel="false" v-if="addSearchSourceFormData.icon">
        <NFlex justify="center" class="w-full">
          <NImage
            :src="addSearchSourceFormData.icon"
            class="h-[80px]"
            ref="imageIns"
            :showToolbar="false"
          >
            <template #error>
              <n-icon :size="80" color="lightGrey">
                <BrokenImageOutlined />
              </n-icon>
            </template>
          </NImage>
        </NFlex>
      </NFormItem>
      <NFormItem :label="`${getLangData('名称')} :`" path="label">
        <NInput
          placeholder="输入名称"
          v-model:value="addSearchSourceFormData.label"
        ></NInput>
      </NFormItem>
      <NFormItem :label="`${getLangData('地址')} :`" path="url">
        <NInput
          :placeholder="`${getLangData('输入地址')} getLangData('例') https://host:port?q={{data}}`"
          v-model:value="addSearchSourceFormData.url"
        ></NInput>
      </NFormItem>
      <NFormItem :label="`${getLangData('图标')} :`">
        <NFlex :wrap="false" class="w-full">
          <NInput
            :placeholder="getLangData('输入地址')"
            v-model:value="addSearchSourceFormData.icon"
            class="flex-1"
            clearable
          ></NInput>
          <NButton
            size="small"
            type="primary"
            @click="uploadSearchSourceIcon"
            >{{ getLangData("上传文件") }}</NButton
          >
        </NFlex>
      </NFormItem>
    </NForm>
  </NModal>
  <NModal
    v-model:show="updateDefaultSystemConfigDialogVisible"
    preset="dialog"
    :title="getLangData('替换根数据')"
    :positiveText="getLangData('更新')"
    @positiveClick="submitUpdateDefault"
    :loading="updateDefaultSystemConfigLoading"
  >
    <NFlex justify="center" class="py-4">
      <NInputOtp
        gap="25px"
        :mask="true"
        :length="4"
        size="large"
        v-model:value="updateDefaultPasswd"
      ></NInputOtp>
    </NFlex>
  </NModal>
</template>
<script setup>
import {
  getNavList,
  getSearchSource,
  settings,
  systemConfig,
  userData,
} from "../stores.js";
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
  PasswordFilled,
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
  CleaningServicesOutlined,
} from "@vicons/material";
import { getLangData } from "../lang/index.js";
const message = useMessage();
const temporaryUserData = reactive({
  name: userData.name,
  passwd: userData.passwd,
});
const setDefaultSystemConfig = () => {
  systemConfig.value = {
    navList: [
      {
        des: "",
        label: "默认分组",
        data: [
          {
            des: "测试地址",
            iconURL: "",
            label: "测试地址",
            url: location.toString(),
          },
        ],
      },
    ],
    searchSource: [
      {
        icon: "",
        label: "",
        url: "{{data}}",
      },
    ],
  };
};
const uploadSystemConfigDialogVisible = ref(false);
const uploadSystemConfigLoading = ref(false);
const updateDefaultSystemConfigDialogVisible = ref(false);
const updateDefaultSystemConfigLoading = ref(false);
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
    .then(({ code, message: m }) => {
      if (code === 0) {
        message.success("更新服务器成功 !");
        return true;
      } else {
        message.error(m);
        return false;
      }
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
const editUnitIndex = ref(undefined);
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
  editUnitIndex.value = undefined;
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
  if (editUnitIndex.value !== undefined) {
    editItem.value.data[editUnitIndex.value] = {
      ...addUnitFormData.value,
    };
  } else {
    editItem.value.data.push({
      ...addUnitFormData.value,
    });
  }
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
const loadDefaultConfigLoading = ref(false);
const loadDefaultConfig = (e) => {
  loadDefaultConfigLoading.value = true;
  loadConfig([
    {
      url: "/systemConfig.json",
    },
  ])
    .then((data) => {
      systemConfig.value = data;
    })
    .finally(() => {
      loadDefaultConfigLoading.value = false;
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
const setSearchSourceIndex = (from, to) => {
  const fromItem = getSearchSource.value[from];
  const toItem = getSearchSource.value[to];
  systemConfig.value.searchSource[from] = toItem;
  systemConfig.value.searchSource[to] = fromItem;
};
// const editSearchSource = ref();
const addSearchSourceDialogVisible = ref(false);
const addSearchSourceItemIndex = ref(-1);
const addSearchSourceFormIns = ref();
const addSearchSourceFormData = ref({
  label: "",
  url: "",
  icon: "",
});
const addSearchSourceFormRules = {
  label: [
    {
      validator: (rule, value) => {
        if (value === "") {
          return new Error("分组名称是必须的");
        }
        return addSearchSourceItemIndex.value < 0
          ? getSearchSource.value.find(({ label }) => label === value)
            ? new Error("已存在同名分组")
            : true
          : true;
      },
      trigger: ["input", "blur"],
    },
  ],
  url: [
    {
      validator: (rule, value) => {
        if (value === "") {
          return new Error("地址是必须的");
        }
        if (!value.includes("{{data}}")) {
          return new Error("必须存在参数填充槽 : {{data}}");
        }
        return addSearchSourceItemIndex.value < 0
          ? getSearchSource.value.find(({ url }) => url === value)
            ? new Error("已存在同名分组")
            : true
          : true;
      },
      trigger: ["input", "blur"],
    },
  ],
  icon: [
    {
      required: true,
      message: "图标是必要的",
    },
  ],
};
const uploadSearchSourceIcon = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", () => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      addSearchSourceFormData.value.icon = reader.result;
    });
    reader.readAsDataURL(input.files[0]);
  });
  input.click();
  input.remove();
};
const submitAddSearchSource = async () => {
  await addSearchSourceFormIns.value.validate();
  if (addSearchSourceItemIndex.value < 0) {
    systemConfig.value.searchSource.push(addSearchSourceFormData.value);
  } else {
    systemConfig.value.searchSource[addSearchSourceItemIndex.value] =
      addSearchSourceFormData.value;
  }
};
const removeSearchSource = (index) => {
  systemConfig.value.searchSource = systemConfig.value.searchSource.filter(
    (_, i) => i !== index,
  );
};
const updateDefaultPasswd = ref([]);
const submitUpdateDefault = async () => {
  updateDefaultSystemConfigLoading.value = true;
  const url = new URL("/api/uploadLocalUserData.php", location.href);
  url.searchParams.set("passwd", updateDefaultPasswd.value.join(""));
  return await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      data: JSON.stringify(toRaw(systemConfig.value)),
    }),
  })
    .then((r) => r.json())
    .then(({ code, message: m }) => {
      if (code === 0) {
        message.success("更新服务器成功 !");
        return true;
      } else {
        message.error(m);
        return false;
      }
    })
    .catch(() => {
      message.error("更新服务器失败 , 请检查 !");
      return false;
    })
    .finally(() => {
      updateDefaultSystemConfigLoading.value = false;
    });
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
