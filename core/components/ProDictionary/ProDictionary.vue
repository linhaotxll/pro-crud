<template>
  <template v-if="contents">
    <a-tag v-for="tag in contents" :key="tag">{{ tag }}</a-tag>
  </template>
</template>

<script lang="ts" setup generic="T">
import { computed } from 'vue'

import type { BodyCellSlotParams } from '../ProTable'

defineOptions({ name: 'ProDictionary' })

const p = defineProps<{
  ctx: BodyCellSlotParams<T>
}>()

const contents = computed(() => {
  const map = p.ctx.column.__column!.dict?.optionsNameMap.value
  return map && p.ctx.text != null
    ? Array.isArray(p.ctx.text)
      ? p.ctx.text.map(t => map[t])
      : [map[p.ctx.text]]
    : undefined
})
</script>
