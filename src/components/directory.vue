<template>
  <NLayoutSider
      v-model:collapsed="collapsed"
      collapseMode="transform"
      :width="narrowScreen?'100%':240"
      :collapsedWidth="0"
      :showTrigger="(narrowScreen&&!collapsed)?false:'arrow-circle'"
      :position="narrowScreen?'absolute':'static'"
      bordered
  >
    <NFlex class="h-full overflow-hidden" vertical>
      <NCard size="small" :bordered="false">
        <div class="flex gap-4">
          <NButton
              v-if="narrowScreen&&!collapsed"
              circle
              strong
              secondary
              type="tertiary"
              class="rounded!"
              @click="()=>collapsed=true"
          >
            <template #icon>
              <KeyboardArrowLeftRound/>
            </template>
          </NButton>
          <NButton
              secondary
              type="primary"
              @click="()=>searchDialogVisible=true"
              class="flex-1 rounded!">
            <template #icon>
              <SearchOutlined/>
            </template>
            搜索 ( CTRL+S )
          </NButton>
          <NButton circle strong secondary type="tertiary" class="rounded!" @click="()=>settingDialogVisible=true">
            <template #icon>
              <SettingsSharp/>
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
              v-for="(item,index) in searchResult"
              :key="item"
              class="p-0! leading-12"
              :class="{'bg-teal-900':index===searchIndex}"
          >
            <a
                :ref="(ins)=>index===searchIndex&&(searchActiveItem=ins)"
                :href="item.url"
                target="_blank"
                class="w-full h-full inline-block px-2 hover:bg-gray-700 rounded">{{ item.label }} - [ {{ item.des }} ]
            </a>
          </NListItem>
        </NList>
      </NFlex>
    </NModal>
    <NModal
        v-model:show="settingDialogVisible"
        preset="dialog"
        type="success"
        title="设置"
        class="w-[500px]!"
        positiveText="完成"
        :closeOnEsc="false"
        :maskClosable="false"
    >
      <template #close>
        <NFlex>
          <NButton secondary size="small" @click="outputConfig" type="tertiary">导出</NButton>
          <NButton secondary size="small" @click="inputConfig" type="primary">导入</NButton>
        </NFlex>
      </template>
      <NList class="h-[40vh] py-2!">
        <NListItem>
          <NFlex justify="space-between">
            <span>默认展开菜单</span>
            <NSwitch v-model:value="settings.menuDefaultExpandAll"></NSwitch>
          </NFlex>
        </NListItem>
        <NListItem>
          <NFlex justify="space-between" align="center">
            <span>外部配置项地址</span>
            <NFlex class="flex-1" justify="flex-end">
              <NInput v-model:value="settings.externalDataUrl" class="flex-[0_0_200px]"
                      placeholder="接口地址 , 只支持GET请求">
              </NInput>
              <NButton @click="uploadSystemConfig"
                       circle
                       strong
                       secondary
                       type="tertiary"
                       class="rounded!"
              >
                <template #icon>
                  <UploadFileFilled/>
                </template>
              </NButton>
            </NFlex>
          </NFlex>
        </NListItem>
        <NListItem>
          <NFlex justify="space-between">
            <span>加载默认设置</span>
            <NSwitch v-model:value="settings.loadDefaultConfig"></NSwitch>
          </NFlex>
        </NListItem>
      </NList>
    </NModal>
  </NLayoutSider>
</template>
<script setup>
import {getNavList, settings} from "../stores.js";
import {computed, h, toRaw, watch} from "vue";
import {NIcon, NImage} from "naive-ui";
import {SearchOutlined, SettingsSharp, KeyboardArrowLeftRound, UploadFileFilled} from '@vicons/material'

const narrowScreen = ref(document.body.clientWidth < 600)
const collapsed = ref(narrowScreen.value)
const searchDialogVisible = ref(false)
const settingDialogVisible = ref(false)
const searchValue = ref('')
const searchInputIns = ref()
const searchIndex=ref(-1)
const searchActiveItem=ref()
const childrenItemsText = computed(() => getNavList.value.map(item => item.data).flat().map(item => JSON.stringify(item)))
const searchResult = computed(() => {
  const reg = new RegExp(`${searchValue.value.trim()}`, 'g')
  const list=childrenItemsText.value.filter(item => reg.test(item)).map(item => JSON.parse(item))
  searchIndex.value=Math.min(list.length-1,Math.max(-1,searchIndex.value))
  return list
})
const searchKeyDown=({key})=>{
  if (key==='ArrowDown'){
    searchIndex.value=Math.min(searchResult.value.length-1,Math.max(-1,searchIndex.value+1))
  }else if (key==='ArrowUp'){
    searchIndex.value=Math.min(searchResult.value.length-1,Math.max(-1,searchIndex.value-1))
  }else if (key==='Enter'){
    searchActiveItem.value?.click()
  }
}
watch(()=>searchActiveItem.value,()=>{
  searchActiveItem.value?.scrollIntoView({
    block: 'center'
  })
})
const renderIcon = ({iconURL, url}) =>
    (iconURL || url) ? h(NIcon, null, () => h(NImage, {
      src: iconURL || `${url}/favicon.ico`,
      width: '100%',
      height: '100%'
    })) : null

const renderLabel = ({url, label}) => {
  if (url) {
    return h("a", {href: url, target: '_blank'}, label)
  } else {
    return label
  }
}
const inputConfig = async () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'Application/json'
  input.addEventListener('change', () => {
    const reader = new FileReader()
    reader.addEventListener('loadend', () => {
      const s = JSON.parse(d)
      for (const key in s) {
        settings[key] = s[key]
      }
    })
    reader.readAsText(input.files[0])
  })
  input.click()
  input.remove()
}
const outputConfig = () => {
  const a = document.createElement('a')
  a.download = 'config.json'
  const blob = new Blob([JSON.stringify(toRaw(settings))])
  a.href = URL.createObjectURL(blob)
  a.click()
  a.remove()
}
const uploadSystemConfig = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'Application/json'
  input.addEventListener('change', () => {
    const reader = new FileReader()
    reader.addEventListener('loadend', () => {
      settings.externalDataUrl=reader.result
    })
    reader.readAsDataURL(input.files[0])
  })
  input.click()
  input.remove()
}
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 's') {
    searchDialogVisible.value = true
    nextTick(() => {
      searchInputIns.value.focus()
    })
    e.stopPropagation()
    e.preventDefault()
  }
})
</script>

<style scoped lang="stylus">
</style>
