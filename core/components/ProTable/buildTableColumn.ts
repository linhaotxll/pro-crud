import { ref, toValue, watchEffect } from 'vue'

import { mergeWithTovalue } from '../common'
import { buildDictionary } from '../ProDictionary'

import type {
  InternalProTableColumnProps,
  ProTableColumnProps,
} from './interface'
import type { DictionaryCollection } from '../ProDictionary'
import type { Ref } from 'vue'

export function buildTableColumn<
  Data = any,
  Dictionary = any,
  Collection = any
>(
  column: ProTableColumnProps<Data, Dictionary, Collection>,
  fetchDictionaryCollection?: DictionaryCollection['fetchDictionaryCollection']
) {
  const result = ref({}) as Ref<InternalProTableColumnProps<Data>>

  watchEffect(() => {
    const {
      show = true,
      type = 'text',
      label,
      name,
      columnProps,
      dict,
      ...rest
    } = column
    // 解析是否显示
    const resolvedShow = toValue(show)

    if (!resolvedShow) {
      result.value = {
        show: resolvedShow,
      }

      return
    }

    // 解析路径
    const resolvedName = toValue(name)
    // 解析类型
    const resolvedType = toValue(type)
    // 解析名称
    const resolvedLabel = toValue(label)

    const resolvedColumnProps = mergeWithTovalue(
      { dataIndex: resolvedName, title: resolvedLabel },
      toValue(columnProps)
    )

    // 解析字典配置
    const resolvedDictionary = buildDictionary(
      dict,
      resolvedType,
      fetchDictionaryCollection
      // dict => {
      //   if (dict.dependences) {
      //     // TODO: scope
      //     return dict.dependences.reduce((prev, dept) => {
      //       set(prev, dept, scope.getFieldValue(dept))
      //       return prev
      //     }, {})
      //   }
      // }
    )

    result.value = {
      show: resolvedShow,
      type: resolvedType,
      columnProps: resolvedColumnProps,
      dictionary: resolvedDictionary,
    }
  })

  return result
}
