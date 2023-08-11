import { computed, ref, watch } from 'vue'

import type { ComputedRef, Ref } from 'vue'

/**
 * 字典配置
 *
 * @internal
 */
export interface DictionaryOption {
  /**
   * 字典列表
   */
  data?: any[]

  /**
   * 动态获取
   */
  fetchData?: () => Promise<any[]>

  /**
   * 名称字段
   *
   * @default 'label'
   */
  labelField?: string

  /**
   * 值字段
   *
   * @default 'value'
   */
  valueField?: string
}

export interface DictionaryResolvedOption {
  label: string
  value: any
  key: string
}

export interface ResolvedColumnDict {
  symbol: symbol
  dict: DictionaryOption
  options: Ref<DictionaryResolvedOption[]>
  optionsNameMap: ComputedRef<Map<any, string>>
  loading: Ref<boolean>
}

const useDictSymbol = Symbol()

export function useDict(
  dict: DictionaryOption | ResolvedColumnDict | undefined
) {
  if (!dict) {
    return
  }

  if ((dict as ResolvedColumnDict).symbol === useDictSymbol) {
    return dict as ResolvedColumnDict
  }

  const options = ref([]) as Ref<DictionaryResolvedOption[]>
  const loading = ref(false)
  const optionsNameMap = computed<Map<any, string>>(() =>
    options.value.reduce((prev, curr) => {
      prev.set(curr.value, curr.label)
      return prev
    }, new Map())
  )

  watch(
    () => dict,
    () => {
      execute()
    },
    { immediate: true }
  )

  /**
   * 获取字典列表
   */
  async function execute() {
    const {
      data,
      fetchData,
      labelField = 'label',
      valueField = 'value',
    } = (dict as DictionaryOption) || {}
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

  const result: ResolvedColumnDict = {
    symbol: useDictSymbol,
    options,
    optionsNameMap,
    loading,
    dict: dict as DictionaryOption,
  }

  return result
}
