<template>
  <a-dropdown
    popper-class="dropdown-select"
    v-bind="$attrs"
    :trigger="trigger"
    arrow
  >
    <template #default>
      <slot />
    </template>

    <template #overlay>
      <a-menu @click="handleSelectMenu">
        <a-menu-item
          v-for="option in options"
          :key="option.value"
          :class="{ selected: value === option.value }"
        >
          {{ option.label }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup generic="T extends object = object">
import type { VNode } from 'vue'

defineProps<{
  options: { label: string; value: string | number | T }[]
  trigger: 'click' | 'hover'
}>()

defineOptions({ name: 'DropdownSelect' })

defineSlots<{
  default?(): VNode[]
}>()

const value = defineModel<string | number | T>()

function handleSelectMenu(ctx: any) {
  value.value = ctx.key
}
</script>

<style>
.dropdown-select .selected.el-dropdown-menu__item:not(.is-disabled) {
  color: var(--el-dropdown-menuItem-hover-color);
  background-color: var(--el-dropdown-menuItem-hover-fill);
}
</style>
