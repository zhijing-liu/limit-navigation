<template>
  <NLayoutContent class="h-full" :class="settings.darkTheme?'bg-neutral-800':'bg-neutral-50!'">
    <NList
        class="h-full overflow-auto bg-transparent!"
        :class="{'snap-y':settings.listScrollAdsorption}"
        :showDivider="false"
    >
      <NListItem
          v-for="item in getNavList"
          :key="item.label"
          class="snap-start"
      >
        <NCard :title="`${item.label} ${item.des??''}`" :bordered="false" size="small" class="bg-transparent!">
          <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-4 gap-y-6 items-start">
            <a v-for="unit in item.data"
               :key="unit.url"
               :href="unit.url"
               :target="settings.aElementTarget">
              <NFlex
                  :class="settings.darkTheme?
                  'border-cyan-800 hover:bg-cyan-900! bg-neutral-800 hover:shadow-cyan-600/50'
                  :'border-cyan-500/30 hover:bg-cyan-400/10! bg-neutral-200/25 hover:shadow-cyan-600/50'"
                  class="
                  px-2
                  border-b-4
                  gap-0!
                  shadow-lg
                  rounded-2xl
                  hover:-top-1
                  duration-300
                  relative"
                  align="center"
              >
                <NAvatar
                    :src="unit.iconURL||`${unit.url}/favicon.ico`"
                    round
                    class="ml-4 mr-2"
                    :fallbackSrc="iconImage"
                ></NAvatar>
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
import {getNavList, settings} from "../stores.js";
import iconImage from '../assets/icon.png'
</script>

<style scoped lang="stylus">
.bbb
  grid-template-rows: auto;

.aaa
  grid-row-end: span 2
</style>
