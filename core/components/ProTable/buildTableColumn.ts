import { ref, toValue } from 'vue'

import { mergeTableColumnOptions } from './constant'

import { mergeWithTovalue } from '../common'
import { buildDictionary } from '../ProDictionary'

import type { ProTableColumnProps } from './interface'
import type {
  InternalColumnOptions,
  InternalProTableColumnProps,
} from './internal'
import type { DataObject } from '../common'
import type { DictionaryCollection } from '../ProDictionary'
import type { Ref } from 'vue'

export function buildTableColumn<
  Data extends DataObject = any,
  Dictionary = any,
  Collection = any
>(
  column: ProTableColumnProps<Data, Dictionary, Collection>,
  columnIndex: number,
  fetchDictionaryCollection?: DictionaryCollection['fetchDictionaryCollection']
) {
  const result = ref({}) as Ref<InternalProTableColumnProps<Data>>

  // watchEffect(() => {
  const {
    show = true,
    type = 'text',
    label,
    name,
    columnProps,
    dict,
    search: _,
    ...rest
  } = column
  // 解析是否显示
  const resolvedShow = toValue(show)

  // 解析路径
  const resolvedName = toValue(name)
  // 解析类型
  const resolvedType = toValue(type)

  if (!resolvedShow) {
    result.value = {
      _column: {
        show: false,
        columnIndex,
        name: resolvedName,
        type: resolvedType,
      },
    }
    return result
  }

  // 解析名称
  const resolvedLabel = toValue(label)

  // 解析字典配置
  const resolvedDictionary = buildDictionary(
    dict,
    resolvedType,
    fetchDictionaryCollection
  )

  const _column: InternalColumnOptions<Data> = mergeWithTovalue(
    {
      columnIndex,
      name: resolvedName,
      type: resolvedType,
      show: resolvedShow,
      dictionary: resolvedDictionary,
    },
    mergeTableColumnOptions,
    rest
  )

  result.value = mergeWithTovalue(
    {
      dataIndex: resolvedName,
      title: resolvedLabel,
      _column,
    },
    toValue(columnProps)
  )

  return result
}
