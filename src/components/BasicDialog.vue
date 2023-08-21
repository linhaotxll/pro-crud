<template>
  <el-drawer v-bind="$attrs">
    <slot />

    <template #footer>
      <slot name="footer" />
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { VNode } from 'vue'

defineOptions({ name: 'BasicDialog' })

defineSlots<{
  default?(): VNode[]
  footer?(): VNode[]
}>()

// const p = defineProps<Partial<DialogProps>>()
</script>
