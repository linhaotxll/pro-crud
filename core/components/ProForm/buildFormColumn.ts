import { merge, set } from 'lodash-es'
import { ref, watchEffect } from 'vue'

import { buildFormListColumns } from './buildFormListColumn'
import {
  DefaultProFormColumn,
  DefaultProSearchWrapperColProps,
  ProFormListPlaceholder,
} from './constant'

import {
  getUuid,
  mergeWithTovalue,
  ensureValueType,
  toValueWithCtx,
} from '../common'
import { buildDictionary } from '../ProDictionary'

import type {
  InternalProFormColumnOptions,
  ProFormColumnOptions,
  ProFormScope,
} from './interface'
import type { DataObject, NamePath } from '../common'
import type { DictionaryCollection } from '../ProDictionary'
import type { ColProps, FormItemProps } from 'ant-design-vue'
import type { ComputedRef, Ref } from 'vue'

export function buildFormColumn<T extends DataObject = DataObject>(
  commonCol: ComputedRef<ColProps | undefined>,
  commonLabelCol: ComputedRef<ColProps> | undefined,
  commonWrapperCol: ComputedRef<ColProps> | undefined,
  isInlineLayout: ComputedRef<boolean>,
  scope: ProFormScope<T>,
  column: ProFormColumnOptions<T>,
  parent?: InternalProFormColumnOptions<T>,
  fetchDictionaryCollection?: DictionaryCollection['fetchDictionaryCollection'],
  onChange?: (internalColumn: InternalProFormColumnOptions<T>) => void
) {
  const internalProFormColumnOptions = ref({}) as Ref<
    InternalProFormColumnOptions<T>
  >

  watchEffect(() => {
    // dict 不能被合并，防止外层 ProTable 传递 dict 被克隆
    column = merge({ dict: column.dict }, DefaultProFormColumn, column)

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
    } = column

    // 解析显示状态
    const resolvedShow = toValueWithCtx(show!)
    // 解析 name
    const resolvedName = appendListName(toValueWithCtx(name), parent?.name)

    const result: InternalProFormColumnOptions<T> = {
      show: resolvedShow,
      name: resolvedName,
    }

    // 只会解析显示的列
    if (!resolvedShow) {
      internalProFormColumnOptions.value = result
      onChange?.(result)
      return
    }

    // 解析 label
    const resolvedLabel = toValueWithCtx(label)
    // 解析 type
    const resolvedType = toValueWithCtx(type!)

    // TODO: 这里嵌套深一点使用 ref
    // 解析 Label Col
    const resolvedLabelCol: ColProps = mergeWithTovalue(
      {},
      toValueWithCtx(commonLabelCol),
      toValueWithCtx(itemProps)?.labelCol
    )

    // 解析 Wrapper Col
    const resolvedWrapperCol: ColProps = mergeWithTovalue(
      {},
      toValueWithCtx(commonWrapperCol),
      toValueWithCtx(itemProps)?.wrapperCol,
      toValueWithCtx(isInlineLayout)
        ? DefaultProSearchWrapperColProps
        : undefined
    )

    // 合并 Form Item Props
    const mergedFormItemPtops: FormItemProps = mergeWithTovalue(
      {
        labelCol: resolvedLabelCol,
        wrapperCol: resolvedWrapperCol,
        name: resolvedName,
        label: resolvedLabel,
      },
      // TODO: 这里要把 labelCol,wrapperCol,name 去掉
      toValueWithCtx(itemProps)
    )

    // 合并 Field Props
    const mergedFieldProps = fieldProps
      ? mergeWithTovalue(
          {},
          ensureValueType()[resolvedType].form?.props,
          toValueWithCtx(fieldProps)
        )
      : undefined

    // 解析列配置
    const resolvedColProps: ColProps | undefined =
      col || commonCol
        ? mergeWithTovalue({}, toValueWithCtx(commonCol), toValueWithCtx(col))
        : undefined

    // 解析子列配置
    const resolvedList =
      list && resolvedType === 'list'
        ? buildFormListColumns(
            commonCol,
            commonLabelCol,
            commonWrapperCol,
            isInlineLayout,
            scope,
            list,
            result
          )
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
      list: resolvedList,
    }

    mergeWithTovalue(result, source, rest)

    result.dictionary = resolvedDictionary

    internalProFormColumnOptions.value = result
    onChange?.(result)
  })

  return internalProFormColumnOptions
}

function appendListName(columnName: NamePath, parentName?: NamePath) {
  if (!parentName) {
    return columnName
  }
  const names = Array.isArray(parentName) ? [...parentName] : [parentName]
  if (Array.isArray(columnName)) {
    names.push(ProFormListPlaceholder, ...columnName)
  } else if (columnName) {
    names.push(ProFormListPlaceholder, columnName)
  }
  return names
}
