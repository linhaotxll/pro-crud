import { once } from 'lodash-es'
import { computed, ref, toValue, watchEffect } from 'vue'

import { ensureDictionary } from './ensureDictionary'

import { isPromise } from '../../utils'

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
  optionFetchCollection: DictionaryCollection<Collection>['fetchDictionaryCollection']
) {
  console.log('buildCDictionary')
  if (!ensureDictionary(type, dictionatyOptions)) {
    return
  }

  const isCollection = typeof optionFetchCollection === 'function'
  const fetchCollectionOnce = isCollection ? once(optionFetchCollection!) : null
  const fetchLoading = ref(false)
  const collectionLoading = isCollection ? ref(false) : null
  const collection = isCollection ? (ref([]) as Ref<Collection>) : null
  const dictionary = ref([]) as Ref<{ label: string; value: any }[]>

  if (isCollection) {
    fetchCollection()
  }

  /**
   * 获取集合数据
   */
  async function fetchCollection() {
    collectionLoading!.value = true

    try {
      const res = await fetchCollectionOnce!()
      collection!.value = res
    } finally {
      collectionLoading!.value = false
    }
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
    fetchDictionary: DictionaryOptions['fetchDictionary'],
    fetchDictionaryInCollection: DictionaryOptions['fetchDictionaryInCollection']
  ) {
    setLoading(true)

    function setDictionary(res: Dictionary[]) {
      dictionary.value = res.map(item => ({
        label: item[labelFieldValue],
        value: item[valueFieldValue],
      }))
    }

    function setLoading(visible: boolean) {
      fetchLoading.value = visible
    }

    let resIsPromise

    try {
      const res = Array.isArray(dataValue)
        ? dataValue
        : typeof fetchDictionary === 'function'
        ? fetchDictionary()
        : typeof fetchDictionaryInCollection === 'function' && collection
        ? fetchDictionaryInCollection(collection)
        : []

      resIsPromise = isPromise(res)

      if (resIsPromise) {
        ;(res as Promise<any>)
          .then(dict => {
            console.log(22222222)
            setDictionary(dict)
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        console.log(11111111)
        setDictionary(res as Dictionary[])
      }
    } finally {
      setLoading(false)
    }
  }

  watchEffect(() => {
    const dictValue = toValue(dictionatyOptions!)
    const {
      data,
      labelField = 'label',
      valueField = 'value',
      dependences,
      fetchDictionary,
      fetchDictionaryInCollection,
    } = dictValue

    const [dataValue, labelFieldValue, valueFieldValue, collectionValue] = [
      toValue(data),
      toValue(labelField),
      toValue(valueField),
      toValue(collection),
    ]

    if (dependences) {
      dependences.forEach(item => {})
    }

    fetchData(
      dataValue,
      labelFieldValue,
      valueFieldValue,
      collectionValue,
      fetchDictionary,
      fetchDictionaryInCollection
    )
  })

  return {
    dictionary,
    loading: computed(() => fetchLoading.value && !!collectionLoading?.value),
  }
}
