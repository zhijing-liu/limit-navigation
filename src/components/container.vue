<template>
  <NLayoutContent
    id="container"
    class="h-full"
    contentClass="flex flex-col"
    :class="settings.darkTheme ? 'bg-neutral-800' : 'bg-neutral-50!'"
  >
    <NFlex v-if="narrowScreen" class="p-3">
      <NButton
        circle
        strong
        secondary
        class="rounded!"
        @click="() => (collapsed = false)"
      >
        <template #icon> <MenuFilled /> </template>
      </NButton>
    </NFlex>
    <NList
      class="flex-1 overflow-auto bg-transparent!"
      :class="{ 'snap-y': settings.listScrollAdsorption }"
      :showDivider="false"
      v-if="disPlayNavList?.length > 0"
      ref="listIns"
    >
      <template v-for="item in disPlayNavList">
        <NListItem
          :key="item.label"
          class="snap-start"
          v-if="item.data?.length > 0"
        >
          <NCard
            :title="`${item.label} ${item.des ?? ''}`"
            :bordered="false"
            size="small"
            class="navUnit bg-transparent!"
          >
            <div
              class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-4 gap-y-6 items-start"
            >
              <a
                v-for="unit in item.data"
                :key="unit.url"
                :href="unit.url"
                :target="settings.aElementTarget"
                @click="
                  () => (counter[unit.url] = (counter[unit.url] ?? 0) + 1)
                "
              >
                <NFlex
                  :class="
                    settings.darkTheme
                      ? 'border-cyan-800 hover:bg-cyan-900! bg-neutral-800 hover:shadow-cyan-600/50'
                      : 'border-cyan-500/30 hover:bg-cyan-400/10! bg-neutral-200/25 hover:shadow-cyan-600/50'
                  "
                  class="px-2 border-b-4 gap-0! shadow-lg rounded-2xl hover:-top-1 duration-300 relative"
                  align="center"
                >
                  <NAvatar
                    :src="unit.iconURL || `${unit.url}/favicon.ico`"
                    round
                    class="ml-4 mr-2"
                    :fallbackSrc="iconImage"
                  ></NAvatar>
                  <NCard
                    :title="unit.label"
                    :bordered="false"
                    class="flex-1 cursor-pointer bg-transparent! overflow-hidden"
                    headerClass="capitalize"
                  >
                    <span
                      class="w-full inline-block whitespace-nowrap overflow-hidden text-ellipsis"
                      >{{ unit.des ?? "" }}</span
                    >
                  </NCard>
                </NFlex>
              </a>
            </div>
          </NCard>
        </NListItem>
      </template>
    </NList>
    <NFlex v-else justify="center" align="center" class="h-full">
      <NEmpty :description="getLangData('没有配置数据源或数据源无数据')">
        <template #extra>
          <NButton secondary @click="() => (settingDialogVisible = true)">{{
            getLangData("前往设置配置数据源")
          }}</NButton>
        </template>
      </NEmpty>
    </NFlex>
    <NBackTop
      v-if="!narrowScreen && listIns"
      :listenTo="listIns?.$el"
      :visibility-height="10"
    >
      <NIcon size="28">
        <ArrowUpwardOutlined />
      </NIcon>
    </NBackTop>
    <!--    <NFloatButton :right="10" :bottom="10" shape="square">-->
    <!--      <NIcon>-->
    <!--        <ArrowUpwardOutlined />-->
    <!--      </NIcon>-->
    <!--    </NFloatButton>-->
  </NLayoutContent>
</template>
<script setup>
import {
  getNavList,
  settings,
  settingDialogVisible,
  getCounter,
  counter,
  narrowScreen,
  collapsed,
} from "../stores.js";
import { MenuFilled, ArrowUpwardOutlined } from "@vicons/material";
import iconImage from "../assets/icon.png";
import { getLangData } from "../lang/index.js";
const listIns = ref();
const disPlayNavList = computed(() => [
  {
    label: "常用",
    des: "",
    data: getCounter.value,
  },
  ...getNavList.value,
]);
</script>

<style scoped lang="stylus"></style>
