import { computed, isRef, ref, watch } from 'vue'

import type { ComputedRef, Ref } from 'vue'

/**
 * 字典列配置
 */
export interface ColumnDictionaryOptions {
  /**
   * 字典配置
   */
  dict?: DictionaryOption
}

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
  options: Ref<DictionaryResolvedOption[]>
  optionsNameMap: ComputedRef<Record<string, string>>
  loading: Ref<boolean>
}

export function useDictCollection<T = any>(
  dictCollection: FetchDictCollection<T> | undefined
) {
  const loading = ref(false)
  const dataSource = ref(null) as Ref<T | null>

  const startLoading = () => (loading.value = true)
  const cancelLoading = () => (loading.value = false)

  if (dictCollection) {
    startLoading()
    dictCollection()
      .then(response => {
        dataSource.value = response
      })
      .finally(() => {
        cancelLoading()
      })
  }

  return {
    dataSource,
    loading,
  }
}

export function useDictionary<T = any>(
  collection: Ref<T[] | null>,
  dictOption: DictionaryOption
) {
  const {
    data,
    fetchData,
    useCollect,
    labelField = 'label',
    valueField = 'value',
  } = dictOption

  const options = ref([]) as Ref<DictionaryResolvedOption[]>

  const loading = ref(false)
  const startLoading = () => (loading.value = true)
  const cancelLoading = () => (loading.value = false)

  async function execute() {
    const _fetchData: () => Promise<any[]> = Array.isArray(data)
      ? () => Promise.resolve(data!)
      : typeof fetchData === 'function'
      ? fetchData
      : typeof useCollect === 'function'
      ? () => useCollect(collection.value)
      : () => Promise.resolve([])

    try {
      startLoading()

      const result = await _fetchData()

      options.value =
        result?.map((item, i) => ({
          label: item[labelField],
          value: item[valueField],
          key: `${i}-${item[valueField]}`,
        })) ?? []
    } finally {
      cancelLoading()
    }
  }

  if (typeof useCollect === 'function') {
    watch(
      collection,
      () => {
        execute()
      },
      { immediate: true }
    )
  } else {
    execute()
  }

  const optionsNameMap = computed(() => {
    return options.value.reduce<Record<string, string>>((prev, curr) => {
      prev[curr.value] = curr.label
      return prev
    }, {})
  })

  return {
    options,
    optionsNameMap,
    loading,
    execute,
  }
}

export function processDictionary(
  fetchDictCollection: FetchDictCollection | undefined
) {
  if (
    typeof fetchDictCollection === 'function' &&
    fetchDictCollection.name === 'processColumnWithDictionary'
  ) {
    return fetchDictCollection as unknown as (
      column: ColumnDictionaryOptions
    ) => ReturnType<typeof useDictionary> | undefined
  }

  // 解析字典集合
  const { dataSource: collection } = useDictCollection(fetchDictCollection)

  return function processColumnWithDictionary(column: ColumnDictionaryOptions) {
    if (isResolveDictionary(column.dict)) {
      return column.dict
    }
    // 解析字典
    let resolvedDictionary: ReturnType<typeof useDictionary> | undefined =
      undefined
    if (column.dict) {
      resolvedDictionary = useDictionary(collection, column.dict)
    }

    return resolvedDictionary
  }
}

function isResolveDictionary(
  value: any
): value is ReturnType<typeof useDictionary> {
  return (
    value &&
    isRef(value.options) &&
    isRef(value.optionsNameMap) &&
    isRef(value.loading) &&
    typeof value.execute === 'function'
  )
}
