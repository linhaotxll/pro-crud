<template>
  <a-tag v-if="content">{{ content }}</a-tag>
</template>

<script lang="ts" setup generic="T">
import { computed } from 'vue'

import type { ValueTypeTableRenderParams } from '../common'

defineOptions({ name: 'ProDictionary' })

const p = defineProps<{
  ctx: ValueTypeTableRenderParams<T>
}>()

const content = computed(() =>
  p.ctx.internalColumn.dict?.optionsNameMap.value.get(p.ctx.text)
)
</script>
