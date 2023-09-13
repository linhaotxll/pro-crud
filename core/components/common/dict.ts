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

  /**
   * 从枚举集合中获取值
   */
  useCollect?: (dictSet: any) => any
}

export type FetchDictCollection<T = any> = () => Promise<T>

export interface DictionaryCollectionOptions {
  /**
   * 字典集
   */
  fetchDictCollection?: FetchDictCollection
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

export function useDictionary(dictCollection: FetchDictCollection | undefined) {
  const loading = ref(false)

  const collection = dictCollection ? ref() : null

  const startLoading = () => (loading.value = true)
  const cancelLoading = () => (loading.value = false)

  if (dictCollection) {
    startLoading()
    dictCollection()
      .then(response => {
        collection!.value = response
      })
      .finally(() => {
        cancelLoading()
      })
  }

  /**
   * 获取字典列表
   */
  async function executeWithData(
    dict: DictionaryOption,
    options: Ref<DictionaryResolvedOption[]>
  ) {
    const {
      data,
      fetchData,
      useCollect,
      labelField = 'label',
      valueField = 'value',
    } = (dict as DictionaryOption) || {}
    try {
      startLoading()

      const _fetchData: () => Promise<any[]> = Array.isArray(data)
        ? () => Promise.resolve(data!)
        : typeof fetchData === 'function'
        ? fetchData
        : typeof useCollect === 'function'
        ? () => useCollect(collection?.value)
        : () => Promise.resolve([])

      const result = await _fetchData()
      options.value = result.map((item, i) => ({
        label: item[labelField],
        value: item[valueField],
        key: `${i}-${item[valueField]}`,
      }))
    } finally {
      cancelLoading()
    }
  }

  function createColumnDict(
    dict: DictionaryOption | ResolvedColumnDict | undefined
  ) {
    if (!dict) {
      return
    }

    if ((dict as ResolvedColumnDict).symbol === useDictSymbol) {
      return dict as ResolvedColumnDict
    }

    const options = ref([]) as Ref<DictionaryResolvedOption[]>
    const optionsNameMap = computed<Map<any, string>>(() =>
      options.value.reduce((prev, curr) => {
        prev.set(curr.value, curr.label)
        return prev
      }, new Map())
    )

    const result: ResolvedColumnDict = {
      symbol: useDictSymbol,
      options,
      optionsNameMap,
      loading,
      dict: dict as DictionaryOption,
    }

    if (result.dict.useCollect && collection) {
      watch(collection, () => {
        executeWithData(result.dict, options)
      })
    } else {
      executeWithData(result.dict, options)
    }

    return result
  }

  return { createColumnDict }
}
