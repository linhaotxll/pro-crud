import { merge } from 'lodash-es'
import { toValue, ref, watchEffect } from 'vue'

import { buildFormListColumns } from './buildFormListColumn'
import { DefaultProFormColumn, ProFormListPlaceholder } from './constant'

import { getUuid, mergeWithTovalue, ensureValueType } from '../common'

import type {
  InternalProFormColumnOptions,
  ProFormColumnOptions,
} from './interface'
import type { ColProps, FormItemProps } from 'ant-design-vue'
import type { NamePath } from 'ant-design-vue/es/form/interface'
import type { ComputedRef, Ref } from 'vue'

export function buildFormColumn<T extends object>(
  commonCol: ComputedRef<ColProps> | undefined,
  commonLabelCol: ComputedRef<ColProps> | undefined,
  commonWrapperCol: ComputedRef<ColProps> | undefined,
  column: ProFormColumnOptions<T>,
  parent?: InternalProFormColumnOptions<T>,
  onChange?: (internalColumn: InternalProFormColumnOptions<T>) => void
) {
  const internalProFormColumnOptions = ref({}) as Ref<
    InternalProFormColumnOptions<T>
  >

  watchEffect(() => {
    column = merge({}, DefaultProFormColumn, column)

    const {
      show,
      name,
      label,
      type,
      itemProps,
      fieldProps,
      col,
      list,
      ...rest
    } = column

    // 解析显示状态
    const resolvedShow = toValue(show!)
    // 解析 name
    // const resolvedName = toValue(name)
    const resolvedName = appendListName(toValue(name), parent?.name)

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
    const resolvedLabel = toValue(label)
    // 解析 type
    const resolvedType = toValue(type!)

    // TODO: 这里嵌套深一点使用 ref
    // 解析 Label Col
    const resolvedLabelCol: ColProps = mergeWithTovalue(
      {},
      toValue(commonLabelCol),
      toValue(itemProps)?.labelCol
    )

    // 解析 Wrapper Col
    const resolvedWrapperCol: ColProps = mergeWithTovalue(
      {},
      toValue(commonWrapperCol),
      toValue(itemProps)?.wrapperCol
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
      toValue(itemProps)
    )

    // 合并 Field Props
    const mergedFieldProps = fieldProps
      ? mergeWithTovalue(
          {},
          ensureValueType()[resolvedType].form?.props,
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
        ? buildFormListColumns(
            commonCol,
            commonLabelCol,
            commonWrapperCol,
            list,
            result
          )
        : undefined

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
