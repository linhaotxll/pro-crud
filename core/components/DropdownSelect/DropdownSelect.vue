<template>
  <el-dropdown
    popper-class="dropdown-select"
    v-bind="$attrs"
    :trigger="trigger"
    @command="handleSelectMenu"
  >
    <template #default>
      <slot />
    </template>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="option in options"
          :key="option.command"
          :command="option.command"
          :class="{ selected: value === option.command }"
        >
          {{ option.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup generic="T extends object = object">
import type { VNode } from 'vue'

defineProps<{
  options: { label: string; command: string | number | T }[]
  trigger: 'click' | 'hover'
}>()

defineOptions({ name: 'DropdownSelect' })

defineSlots<{
  default?(): VNode[]
}>()

const value = defineModel<string | number | T>()

function handleSelectMenu(command: string | number | T) {
  value.value = command
}
</script>

<style>
.dropdown-select .selected.el-dropdown-menu__item:not(.is-disabled) {
  color: var(--el-dropdown-menuItem-hover-color);
  background-color: var(--el-dropdown-menuItem-hover-fill);
}
</style>
