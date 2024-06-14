import { mergeWithTovalue, toValueWithCtx } from '../common'
import { mergeWithUnref } from '../common/merge'
import { buildDictionary } from '../ProDictionary'

import type { ProTableColumnProps } from './interface'
import type {
  InternalColumnOptions,
  InternalProTableColumnProps,
} from './internal'
import type { DataObject } from '../common'
import type { DictionaryCollection } from '../ProDictionary'

export function buildTableColumn<
  Data extends DataObject = any,
  Dictionary = any,
  Collection = any
>(
  column: ProTableColumnProps<Data, Dictionary, Collection>,
  fetchDictionaryCollection?: DictionaryCollection['fetchDictionaryCollection']
): InternalProTableColumnProps | undefined {
  let result: InternalProTableColumnProps | undefined = undefined
  // const result = ref({}) as Ref<InternalProTableColumnProps<Data>>

  // watchEffect(() => {
  const {
    show = true,
    type = 'text',
    label,
    name,
    columnProps,
    dict,
    search: _,
    // renderCell,
    ...rest
  } = column
  // 解析是否显示
  const resolvedShow = toValueWithCtx(show)

  if (!resolvedShow) {
    return
  }

  // 解析路径
  const resolvedName = toValueWithCtx(name)
  // 解析类型
  const resolvedType = toValueWithCtx(type)
  // 解析名称
  const resolvedLabel = toValueWithCtx(label)

  // 解析字典配置
  const resolvedDictionary = buildDictionary(
    dict,
    resolvedType,
    fetchDictionaryCollection
  )

  const _column: InternalColumnOptions<Data> = mergeWithUnref(
    {
      name: resolvedName,
      type: resolvedType,
      show: resolvedShow,
      dictionary: resolvedDictionary,
    },
    rest
  )

  result = mergeWithTovalue(
    {
      dataIndex: resolvedName,
      title: resolvedLabel,
      _column,
    },
    toValueWithCtx(columnProps)
  )

  return result
}
