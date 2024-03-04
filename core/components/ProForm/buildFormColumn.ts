import { toValue, ref, watchEffect } from 'vue'

import { ValueTypeMap, getUuid, mergeWithTovalue } from '../common'

import type {
  InternalProFormColumnOptions,
  ProFormColumnOptions,
} from './interface'
import type { ColProps, FormItemProps } from 'ant-design-vue'
import type { ComputedRef, Ref } from 'vue'

export function buildFormColumn<T extends object>(
  commonCol: ComputedRef<ColProps> | undefined,
  commonLabelCol: ComputedRef<ColProps> | undefined,
  commonWrapperCol: ComputedRef<ColProps> | undefined,
  column: ProFormColumnOptions<T>
) {
  const internalProFormColumnOptions = ref({}) as Ref<
    InternalProFormColumnOptions<T>
  >

  watchEffect(() => {
    const {
      show = true,
      name,
      label,
      type = 'text',
      itemProps,
      fieldProps,
      col,
      ...rest
    } = column

    // 解析显示状态
    const resolvedShow = toValue(show)

    const result: InternalProFormColumnOptions<T> = { show: resolvedShow }

    // 只会解析显示的列
    if (!resolvedShow) {
      internalProFormColumnOptions.value = result
      return
    }

    // 解析 name
    const resolvedName = toValue(name)
    // 解析 label
    const resolvedLabel = toValue(label)
    // 解析 type
    const resolvedType = toValue(type)

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
          ValueTypeMap.value[resolvedType].form?.props,
          toValue(fieldProps)
        )
      : undefined

    // 解析列配置
    const resolvedColProps: ColProps | undefined =
      col || commonCol
        ? mergeWithTovalue({}, toValue(commonCol), toValue(col))
        : undefined

    mergeWithTovalue(
      result,
      {
        key: Array.isArray(resolvedName)
          ? resolvedName.join('.')
          : resolvedName || getUuid(),
        itemProps: mergedFormItemPtops,
        fieldProps: mergedFieldProps,
        name: resolvedName,
        col: resolvedColProps,
        type: resolvedType,
      },
      rest
    )

    internalProFormColumnOptions.value = result
  })

  return internalProFormColumnOptions
}
