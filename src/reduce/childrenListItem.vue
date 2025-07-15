<template>
  <NListItem
    class="hover:bg-gray-600/40 rounded px-2! cursor-pointer py-2! bg-gray-300/20 mb-1 border-blue-400"
    ref="itemIns"
    :class="{
      'fixed!': dragItem.item?.url === unit.url,
      'z-[999]!': dragItem.item?.url === unit.url,
      'pointer-events-none': dragItem.item?.url === unit.url,
      listItem: dragItem.item?.url != unit.url,
      'border-t-2': dragIntoItem.item?.url === unit.url && !dragIntoItem.next,
      'border-b-2': dragIntoItem.item?.url === unit.url && dragIntoItem.next,
    }"
    :style="getStyle"
  >
    <NFlex justify="space-between" align="center" class="w-[600px]">
      <span>{{ unit.label }}</span>
      <NFlex align="center">
        <NButton
          circle
          size="small"
          class="rounded!"
          type="primary"
          @click="() => emits('edit')"
        >
          <template #icon><EditFilled /></template>
        </NButton>
        <NPopconfirm
          @positiveClick="() => emits('delete')"
          :negativeText="getLangData('不了')"
          :positiveText="getLangData('是的')"
        >
          <template #trigger>
            <NButton circle size="small" class="rounded!" type="error">
              <template #icon><DeleteForeverTwotone /></template>
            </NButton>
          </template>
          {{ getLangData("确定要删除当前地址？") }}
        </NPopconfirm>
        <NIcon class="h-full!" @mousedown="startDrag">
          <DragIndicatorFilled />
        </NIcon>
      </NFlex>
    </NFlex>
  </NListItem>
</template>
<script setup lang="ts">
import { NButton } from "naive-ui";
import {
  DeleteForeverTwotone,
  DragIndicatorFilled,
  EditFilled,
} from "@vicons/material";
import { computed, ref } from "vue";
import { getLangData } from "../lang/index.js";
const { unit } = defineProps(["unit"]);
import { dragIntoItem, dragItem } from "./store.js";
const emits = defineEmits(["edit", "delete", "moveTo"]);
const getStyle = computed(() => {
  if (unit.url === dragItem.item?.url) {
    return `left:${dragItem.left}px;top:${dragItem.top}px;`;
  } else {
    return "";
  }
});
const itemIns = ref();
const startDrag = (e) => {
  const { y } = e;
  const { left, top, right } = itemIns.value.$el.getBoundingClientRect();
  dragItem.top = top;
  dragItem.left = left;
  dragItem.item = unit;
  e.stopPropagation();
  e.preventDefault();
  const center = (left + right) / 2;
  const move = ({ y: nY }) => {
    dragItem.top = nY - y + top;
    const items = document.elementsFromPoint(center, nY);
    const dragOnItem = items.find((item) =>
      item.getAttribute("attr-groupName"),
    );
    if (dragOnItem) {
      let closestDistance = +Infinity;
      let nearItem;
      let index;
      const items = [...dragOnItem.querySelectorAll(".listItem")];
      for (const i in items) {
        const item = items[i];
        const ins = Math.abs(item.getBoundingClientRect().top - dragItem.top);
        if (ins < closestDistance) {
          closestDistance = ins;
          nearItem = item;
          index = +i;
        }
      }
      const url = nearItem.getAttribute("attr-itemName");
      dragIntoItem.next = nearItem.getBoundingClientRect().top < dragItem.top;
      dragIntoItem.item = {
        url,
        parent: +dragOnItem.getAttribute("attr-groupName"),
        index: dragIntoItem.next ? index + 1 : index,
      };
    }
  };
  const end = (e) => {
    emits("delete");
    move(e);
    const { parent, index } = dragIntoItem.item;
    emits("moveTo", parent, index, unit);
    dragIntoItem.item = {};
    dragItem.item = null;
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", end);
  };
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
};
</script>
<style scoped lang="stylus"></style>
