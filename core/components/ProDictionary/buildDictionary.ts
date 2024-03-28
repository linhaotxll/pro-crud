import { computed, ref, toValue, watchEffect } from 'vue'

import { ensureDictionary } from './ensureDictionary'

import { isArray, isFunction, isPromise } from '../../utils'

import type {
  DictionaryCollection,
  DictionaryColumn,
  DictionaryOptions,
} from './interface'
import type { ValueType } from '../common'
import type { Ref } from 'vue'

export function buildDictionary<Dictionary = any, Collection = any>(
  dictionatyOptions: DictionaryColumn['dict'],
  type: ValueType,
  optionFetchCollection: DictionaryCollection<Collection>['fetchDictionaryCollection'],
  fetchDataEffect?: (dict: DictionaryOptions<Dictionary, Collection>) => any
) {
  console.log('buildCDictionary')
  if (!ensureDictionary(type, dictionatyOptions)) {
    return
  }

  const isCollection = typeof optionFetchCollection === 'function'
  const fetchLoading = ref(false)
  const collectionLoading = isCollection ? ref(false) : null
  const collection = isCollection ? (ref() as Ref<Collection>) : null
  const dictionary = ref([]) as Ref<{ label: string; value: any }[]>

  if (isCollection) {
    fetchCollection()
  }

  function fetchWithLoding<T extends Dictionary[] | Collection>(
    loading: Ref<boolean>,
    request: () => Promise<T> | T,
    assign: (res: T) => void
  ) {
    // 是否是 Promise
    let isPromiseFetch = false

    try {
      // 开启 loading
      loading.value = true
      // 调用请求
      const result = request()

      if ((isPromiseFetch = isPromise(result))) {
        result
          .then(res => {
            // 赋值
            assign(res)
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        // 赋值
        assign(result)
      }
    } finally {
      // 非 Promise 关闭 loading
      if (!isPromiseFetch) {
        loading.value = false
      }
    }
  }

  /**
   * 获取集合数据
   */
  function fetchCollection() {
    fetchWithLoding(collectionLoading!, optionFetchCollection!, res => {
      collection!.value = res as Collection
    })
  }

  /**
   * 获取字典数据
   *
   * 1. 集合发生变化
   * 2. data 发生变化
   * 3. label/value 发生变化
   */
  function fetchData(
    dataValue: Dictionary[] | undefined,
    labelFieldValue: string,
    valueFieldValue: string,
    collection: Collection | null,
    deptParams: any,
    fetchDictionary: DictionaryOptions['fetchDictionary'],
    fetchDictionaryInCollection: DictionaryOptions['fetchDictionaryInCollection']
  ) {
    fetchWithLoding<Dictionary[]>(
      fetchLoading,
      () => {
        const res = isArray(dataValue)
          ? dataValue
          : isFunction(fetchDictionary)
          ? fetchDictionary(deptParams)
          : isFunction(fetchDictionaryInCollection) && collection
          ? fetchDictionaryInCollection(collection)
          : []
        return res
      },
      setDictionary
    )

    function setDictionary(res: Dictionary[] | undefined) {
      if (isArray(res)) {
        dictionary.value = res.map((item: any) => ({
          label: item[labelFieldValue],
          value: item[valueFieldValue],
        }))
      }
    }
  }

  watchEffect(() => {
    const dictValue = toValue(dictionatyOptions!)
    const {
      data,
      labelField = 'label',
      valueField = 'value',
      fetchDictionary,
      fetchDictionaryInCollection,
    } = dictValue

    const [dataValue, labelFieldValue, valueFieldValue, collectionValue] = [
      toValue(data),
      toValue(labelField),
      toValue(valueField),
      toValue(collection),
    ]

    const deptParams = fetchDataEffect?.(dictValue)

    fetchData(
      dataValue,
      labelFieldValue,
      valueFieldValue,
      collectionValue,
      deptParams,
      fetchDictionary,
      fetchDictionaryInCollection
    )
  })

  return {
    dictionary,
    loading: computed(() => fetchLoading.value || !!collectionLoading?.value),
  }
}
