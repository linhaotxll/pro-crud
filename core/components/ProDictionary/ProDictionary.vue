<template>
  <a-tag v-if="content">{{ content }}</a-tag>
</template>

<script lang="ts" setup generic="T">
import { computed } from 'vue'

import type { BodyCellSlotParams } from '../ProTable'

defineOptions({ name: 'ProDictionary' })

const p = defineProps<{
  ctx: BodyCellSlotParams<T>
}>()

const content = computed(() =>
  p.ctx.column.__column!.dict?.optionsNameMap.value.get(p.ctx.text)
)
</script>
