import { set } from 'lodash-es'
import { ref, toValue } from 'vue'

import { buildFormListColumns } from './buildFormListColumn'
import { DefaultProFormColumn, ProFormListPlaceholder } from './constant'

import { getUuid, mergeWithTovalue } from '../common'
import { buildDictionary } from '../ProDictionary'

import { getGlobalOptions } from '~/constant'
import { isArray, isNil } from '~/utils'

import type {
  InternalProFormColumnOptions,
  ProFormColumnOptions,
  ProFormScope,
} from './interface'
import type { DataObject, NamePath } from '../common'
import type { DictionaryCollection } from '../ProDictionary'
import type { ColProps, FormItemProps } from 'ant-design-vue'
import type { ComputedRef } from 'vue'

export function buildFormColumn<T extends DataObject = DataObject>(
  commonCol: ComputedRef<ColProps | undefined>,
  isInlineLayout: ComputedRef<boolean>,
  scope: ProFormScope<T>,
  column: ProFormColumnOptions<T>,
  parent?: InternalProFormColumnOptions<T>,
  fetchDictionaryCollection?: DictionaryCollection['fetchDictionaryCollection'],
  onChange?: (internalColumn: InternalProFormColumnOptions<T>) => void,
  formName?: NamePath
) {
  // dict 不能被合并，防止外层 ProTable 传递 dict 被克隆
  const mergedColumn: ProFormColumnOptions<any, any, any> = mergeWithTovalue(
    { dict: column.dict },
    DefaultProFormColumn,
    column
  )

  const {
    show,
    name,
    label,
    type,
    itemProps,
    fieldProps,
    col,
    list,
    dict,
    ...rest
  } = mergedColumn

  // 解析显示状态
  const resolvedShow = toValue(show!)
  // 解析 name
  const resolvedName = appendListName(
    toValue(name),
    parent?.name,
    parent ? ProFormListPlaceholder : undefined,
    formName
  )
  // 解析 type
  const resolvedType = toValue(type!)

  if (!getGlobalOptions().types[resolvedType]) {
    throw new Error(`"${resolvedType}" not found`)
  }

  const result: InternalProFormColumnOptions<T> = {
    show: resolvedShow,
    name: resolvedName,
    type: resolvedType,
    instance: ref(),
  }

  // 只会解析显示的列
  if (!resolvedShow) {
    // internalProFormColumnOptions.value = result
    onChange?.(result)
    return result
  }

  // 解析 label
  const resolvedLabel = toValue(label)

  // 合并 Form Item Props
  const mergedFormItemPtops: FormItemProps = mergeWithTovalue(
    {
      name: resolvedName,
      label: resolvedLabel,
    },
    // TODO: 这里要把 labelCol,wrapperCol,name 去掉
    toValue(itemProps)
  )

  // 合并 Field Props
  const mergedFieldProps = fieldProps
    ? mergeWithTovalue(
        {},
        null,
        getGlobalOptions().types[resolvedType].form?.context,
        toValue(fieldProps)
      )
    : undefined

  // 解析列配置
  const resolvedColProps: ColProps | undefined =
    col || commonCol
      ? mergeWithTovalue({}, toValue(commonCol), toValue(col))
      : undefined

  // 解析子列配置
  const resolvedList =
    list && resolvedType === 'list'
      ? buildFormListColumns(commonCol, isInlineLayout, scope, list, result)
      : undefined

  // 解析字典配置
  const resolvedDictionary = buildDictionary(
    dict,
    resolvedType,
    fetchDictionaryCollection,
    dict => {
      if (dict.dependences) {
        // TODO: scope
        return dict.dependences.reduce((prev, dept) => {
          set(prev, dept, scope.getFieldValue(dept))
          return prev
        }, {})
      }
    }
  )

  const source: Partial<InternalProFormColumnOptions<any>> = {
    key: Array.isArray(resolvedName)
      ? resolvedName.join('.')
      : resolvedName || getUuid(),
    itemProps: mergedFormItemPtops,
    fieldProps: mergedFieldProps,
    name: resolvedName,
    col: resolvedColProps,
    type: resolvedType,
  }

  // TODO: result.name 有 3 个元素，source.name 也有 3 个元素
  mergeWithTovalue(result, source, rest)

  result.dictionary = resolvedDictionary
  result.list = resolvedList

  // internalProFormColumnOptions.value = result
  onChange?.(result)
  return result
}

export function appendListName(
  columnName: NamePath,
  ...parents: (NamePath | undefined | null)[]
) {
  if (!parents.length) {
    return columnName
  }

  const names: (string | number)[] = []

  for (const parent of parents) {
    if (isArray(parent)) {
      names.push(...parent)
    } else if (!isNil(parent)) {
      names.push(parent)
    }
  }

  if (isArray(columnName)) {
    names.push(...columnName)
  } else {
    names.push(columnName)
  }

  // const names = Array.isArray(parentName) ? [...parentName] : [parentName]
  // if (Array.isArray(columnName)) {
  //   names.push(ProFormListPlaceholder, ...columnName)
  // } else if (columnName != null) {
  //   names.push(ProFormListPlaceholder, columnName)
  // }
  return names.length === 1 ? names[0] : names
}
