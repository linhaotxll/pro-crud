<template>
  <el-select v-model="value" v-bind="resolvedProps" :loading="loading">
    <el-option
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
      :label="opt.label"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

import type { DictionaryOption } from '../ProForm'
import type { Ref } from 'vue'

defineOptions({
  name: 'ProSelect',
})

const value = defineModel()

const props = defineProps<{
  dict: DictionaryOption
  resolvedProps: any
}>()

const options = ref([]) as Ref<
  { label: string; value: string | number | symbol | object }[]
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
  } = props.dict
  try {
    loading.value = true
    const _fetchData: () => Promise<any[]> = Array.isArray(data)
      ? () => Promise.resolve(data!)
      : typeof fetchData === 'function'
      ? fetchData
      : () => Promise.resolve([])

    const result = await _fetchData()
    options.value = result.map(item => ({
      label: item[labelField],
      value: item[valueField],
    }))
  } finally {
    loading.value = false
  }
}

watch(
  () => props.dict,
  () => {
    fetchDictionaryList()
  },
  { immediate: true }
)
</script>
