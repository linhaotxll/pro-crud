<template>
  <el-select
    v-if="config.options"
    v-model="value"
    v-bind="$attrs"
    :loading="config.loading?.value"
  >
    <el-option
      v-for="opt in config.options.value"
      :key="opt.key"
      :value="opt.value"
      :label="opt.label"
    />
  </el-select>
</template>

<script lang="ts" setup generic="T extends object">
import { computed, watch, triggerRef } from 'vue'

import type { InternalProFormColumnOptions } from '../ProForm'

defineOptions({
  name: 'ProSelect',
})

const p = defineProps<{
  column: InternalProFormColumnOptions<T>
}>()

const value = defineModel<string | number | boolean | object>()
const config = computed(() => {
  const { dict } = p.column
  const { loading, options } = dict || {}
  return { loading, options }
})

// 当 options 变化时，主动追踪 value 的依赖，更新 el-select 中回显的值
watch(config, () => {
  triggerRef(value)
})
</script>
