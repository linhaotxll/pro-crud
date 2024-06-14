import { ref, watchEffect } from 'vue'

import { buildFormColumn } from './buildFormColumn'
import {
  DefaultCopyRecordButtonProps,
  DefaultCreateRecordButtonProps,
  DefaultDeleteRecordButtonProps,
  DefaultFormListSpaceProps,
} from './constant'

import { mergeWithTovalue, toValueWithCtx } from '../common'

import type {
  InternalProFormColumnOptions,
  ProFormColumnOptions,
  ProFormScope,
} from './interface'
import type { ColProps } from 'ant-design-vue'
import type { ComputedRef, Ref } from 'vue'

export function buildFormListColumns(
  commonCol: ComputedRef<ColProps | undefined>,
  commonLabelCol: ComputedRef<ColProps> | undefined,
  commonWrapperCol: ComputedRef<ColProps> | undefined,
  isInlineLayout: ComputedRef<boolean>,
  scope: ProFormScope<any>,
  list: ProFormColumnOptions<any>['list'],
  parent: InternalProFormColumnOptions<any>
) {
  const resolvedList: InternalProFormColumnOptions<any>['list'] = ref()

  watchEffect(() => {
    // 监听 list 本身发生变化
    const listValue = toValueWithCtx(list)

    if (!listValue) {
      resolvedList.value = undefined
      return
    }

    // 监听 children 本身发生变化
    const {
      children,
      deleteButtonProps,
      copyButtonProps,
      creatorButtonProps,
      space,
      ...rest
    } = listValue
    const childrenValue = toValueWithCtx(children)
    if (!childrenValue || !childrenValue.length) {
      resolvedList.value = undefined
      return
    }

    const resolvedChildColumns: Ref<InternalProFormColumnOptions<any>>[] = []
    for (let i = 0; i < childrenValue.length; ++i) {
      resolvedChildColumns.push(
        buildFormColumn(
          commonCol,
          commonLabelCol,
          commonWrapperCol,
          isInlineLayout,
          scope,
          childrenValue[i],
          parent
        )
      )
    }

    // 复制按钮
    const copyButtonPropsValue = toValueWithCtx(copyButtonProps)
    const mergedCopyButtonProps =
      copyButtonPropsValue !== false
        ? mergeWithTovalue(
            {},
            DefaultCopyRecordButtonProps,
            copyButtonPropsValue
          )
        : copyButtonPropsValue

    // 删除按钮
    const deleteButtonPropsValue = toValueWithCtx(deleteButtonProps)
    const mergedDeleteButtonProps =
      deleteButtonPropsValue !== false
        ? mergeWithTovalue(
            {},
            DefaultDeleteRecordButtonProps,
            deleteButtonPropsValue
          )
        : deleteButtonPropsValue

    // 创建按钮
    const createButtonPropsValue = toValueWithCtx(creatorButtonProps)
    const mergedCreatorButtonProps =
      createButtonPropsValue !== false
        ? mergeWithTovalue(
            {},
            DefaultCreateRecordButtonProps,
            createButtonPropsValue
          )
        : createButtonPropsValue

    // 每行 Space Props
    const reoslvedSpaceProps = mergeWithTovalue(
      {},
      DefaultFormListSpaceProps,
      toValueWithCtx(space)
    )

    resolvedList.value = {
      ...rest,
      creatorButtonProps: mergedCreatorButtonProps,
      copyButtonProps: mergedCopyButtonProps,
      deleteButtonProps: mergedDeleteButtonProps,
      children: resolvedChildColumns,
      space: reoslvedSpaceProps,
    }
  })

  return resolvedList
}
