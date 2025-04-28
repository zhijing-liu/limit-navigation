<template>
  <NLayoutContent class="h-full">
    <NList class="snap-y h-full overflow-auto">
      <NListItem
          v-for="item in getNavList"
          :key="item.label"
          class="snap-start"
      >
        <NCard :title="`${item.label} ${item.des??''}`" :bordered="false">
          <!--          <template #header-extra>-->
          <!--            <NButton secondary type="primary">-->
          <!--              <template #icon>-->
          <!--                <ModeEditOutlineOutlined/>-->
          <!--              </template>-->
          <!--            </NButton>-->
          <!--          </template>-->
          <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2 items-start">
            <a v-for="unit in item.data"
               :key="unit.url"
               :href="unit.url"
               target="_blank">
              <NFlex
                  class="
                  border-b-4
                  shadow-lg
                  shadow-cyan-700/50
                  rounded-2xl
                  border-cyan-800
                  hover:bg-cyan-900!
                  bg-neutral-800
                  hover:shadow-cyan-600/50
                  hover:-top-1
                  duration-300
                  relative"
                  align="center"
              >
                <NAvatar :src="unit.iconURL||`${unit.url}/favicon.ico`" round class="ml-4"></NAvatar>
                <NCard
                    :title="unit.label"
                    :bordered="false"
                    class="flex-1 cursor-pointer bg-transparent! overflow-hidden "
                    headerClass="capitalize"
                >
                  <span class="w-full inline-block whitespace-nowrap overflow-hidden text-ellipsis">{{
                      unit.des ?? ''
                    }}</span>
                </NCard>
              </NFlex>
            </a>
          </div>
        </NCard>
      </NListItem>
    </NList>
  </NLayoutContent>
</template>
<script setup>
import {getNavList} from "../stores.js";
</script>

<style scoped lang="stylus">
.bbb
  grid-template-rows: auto;

.aaa
  grid-row-end: span 2
</style>
