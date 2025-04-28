<template>
  <NConfigProvider :theme="darkTheme" class="w-full">
    <NGlobalStyle/>
    <NLayout hasSider class="h-full">
      <Directory/>
      <Container/>
    </NLayout>
  </NConfigProvider>
</template>
<script setup>
import {darkTheme} from 'naive-ui'
import Directory from './components/directory.vue'
import Container from './components/container.vue'
import {systemConfig, settings} from "./stores.js";
import {toRaw, watch} from "vue";

watch(() => settings, async () => {
  const data=(await Promise.allSettled(
      [
        settings.loadDefaultConfig?fetch(`/systemConfig.json?t=${new Date().getTime()}`, {
          method: 'GET'
        }).then(res => res.json()):[],
        settings.externalDataUrl?fetch(settings.externalDataUrl,{
          method:'GET'
        }).then(r=>r.json()).catch(()=>({})):{}
      ]
  )).filter(item=>item.status==='fulfilled').map(item=>item.value)
  const navList=data.map(item=>item.navList??[]).flat()
  for (const item of data){
    systemConfig.value={
      ...systemConfig.value,
      ...item,
    }
  }
  systemConfig.value={
    ...systemConfig.value,
    navList,
  }
  localStorage.setItem('settings',JSON.stringify(toRaw(settings)))
},{
  immediate:true,
  deep:true
})
</script>
<style lang="stylus">
body
  padding 0
  margin 0
  width 100svw
  height 100svh

  #app
    height 100%
    width 100%
    overflow hidden
    display flex
</style>
