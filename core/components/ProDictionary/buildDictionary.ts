import {
  computed,
  markRaw,
  nextTick,
  ref,
  toRaw,
  toValue,
  watchEffect,
} from 'vue'

import { ensureDictionary } from './ensureDictionary'

import { isArray, isFunction } from '../../utils'
import { fetchWithLoding, type ValueType } from '../common'

import type {
  BuildDictionaryResult,
  DictionaryCollection,
  DictionaryColumn,
  DictionaryOption,
  DictionaryOptions,
} from './interface'
import type { Ref } from 'vue'

const dictionaryCache = new WeakMap<any, any>()

export function buildDictionary<Dictionary = any, Collection = any>(
  dictionatyOptions: DictionaryColumn['dict'],
  type: ValueType,
  optionFetchCollection: DictionaryCollection<Collection>['fetchDictionaryCollection'],
  fetchDataEffect?: (dict: DictionaryOptions<Dictionary, Collection>) => any
): BuildDictionaryResult | undefined {
  if (!ensureDictionary(type, dictionatyOptions)) {
    return
  }

  const dictionatyOptionsValue = toRaw(dictionatyOptions)

  if (dictionatyOptionsValue && dictionaryCache.has(dictionatyOptionsValue)) {
    return dictionaryCache.get(dictionatyOptionsValue)
  }

  const isCollection = typeof optionFetchCollection === 'function'
  const fetchLoading = ref(false)
  const collectionLoading = isCollection ? ref(false) : null
  const collection = isCollection ? (ref() as Ref<Collection>) : null
  const dictionary = ref([]) as Ref<DictionaryOption[]>
  const dictionaryMap = computed(() =>
    dictionary.value.reduce((prev, curr) => {
      prev[curr.value] = curr
      return prev
    }, {} as Record<PropertyKey, DictionaryOption>)
  )

  if (isCollection) {
    fetchCollection()
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
          color: item.color,
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

    // 获取数据放在刷新节点后执行，防止在 fetchData 中存在同步修改响应式数据的情况
    nextTick().then(() => {
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
  })

  // 返回对象标记为非响应式，避免获取里面的 ref 属性自动解绑
  const result = markRaw({
    dictionary,
    dictionaryMap,
    loading: computed(() => fetchLoading.value || !!collectionLoading?.value),
  })

  // markIgnoreMerge(dictionatyOptionsValue)
  dictionaryCache.set(dictionatyOptionsValue, result)

  return result
}
