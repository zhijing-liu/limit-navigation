import {ref,toRaw} from "vue";

export const systemConfig=ref({navList:[]})

export const getNavList=computed(()=>systemConfig.value.navList??[])

export const settings=reactive({
    menuDefaultExpandAll:true,
    externalDataUrl:"",
    loadDefaultConfig:true,
    ...JSON.parse(localStorage.getItem('settings')??"{}")
})
