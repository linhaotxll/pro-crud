<template>
  <el-select v-model="value" v-bind="column.resolvedProps" :loading="loading">
    <el-option
      v-for="opt in options"
      :key="opt.key"
      :value="opt.value"
      :label="opt.label"
    />
  </el-select>
</template>

<script lang="ts" setup generic="T extends object">
import { ref, watch } from 'vue'

import type { InternalProFormColumnOptions } from '../ProForm'
import type { Ref } from 'vue'

defineOptions({
  name: 'ProSelect',
})

const value = defineModel<string | number | boolean | object>()

const props = defineProps<{
  column: InternalProFormColumnOptions<T>
}>()

const options = ref([]) as Ref<
  { label: string; value: string | number | boolean | object; key: string }[]
>
const loading = ref(false)

/**
 * 获取字典列表
 */
async function fetchDictionaryList() {
  const {
    data,
    fetchData,
    labelField = 'label',
    valueField = 'value',
  } = props.column.dict || {}
  try {
    loading.value = true
    const _fetchData: () => Promise<any[]> = Array.isArray(data)
      ? () => Promise.resolve(data!)
      : typeof fetchData === 'function'
      ? fetchData
      : () => Promise.resolve([])

    const result = await _fetchData()
    options.value = result.map((item, i) => ({
      label: item[labelField],
      value: item[valueField],
      key: `${i}-${item[valueField]}`,
    }))
  } finally {
    loading.value = false
  }
}

watch(
  () => props.column.dict,
  () => {
    fetchDictionaryList()
  },
  { immediate: true }
)
</script>
