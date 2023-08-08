import { ElButton, ElMessage, ElMessageBox, ElPopconfirm } from 'element-plus'
import { merge } from 'lodash-es'

import { unRef } from '../common'

import type {
  CrudOperateOption,
  BuildCrudContext,
  CrudOperateButtonOption,
  CrudDeleteConfirmProps,
  CrudDeleteMessageBoxProps,
} from './interface'
import type { ElButtonProps, ElPopconfirmProps } from '../common'
import type { TableDefaultSlotParams } from '../ProTable'
import type { Action } from 'element-plus'

export function useOperate(ctx: BuildCrudContext) {
  async function deleteItem(row: TableDefaultSlotParams<any>) {
    const response = await ctx.optionResult.request?.deleteRequest?.(
      row.row,
      row.$index
    )

    if (response) {
      ctx.scope.table.reload()
      ElMessage.success('删除成功')
    }
  }

  const mergeOperate: CrudOperateOption = merge<
    CrudOperateOption,
    CrudOperateOption | undefined
  >(
    {
      label: '操作',
      prop: 'operate',
      buttons: {
        edit: {
          show: true,
          text: '编辑',
          confirmType: false,
          order: 1,
          props: {
            type: 'primary',
            onClick(e, { row }) {
              e.stopPropagation()
              ctx.scope.editForm.showDialog(row)
            },
          },
        },
        delete: {
          show: true,
          text: '删除',
          order: 2,
          props: { type: 'danger' },
          confirmType: 'messagebox',
          confirmProps: {
            onConfirm(e, ctx) {
              e.stopPropagation()
              deleteItem(ctx)
            },
            callback(action: Action, ctx) {
              if (action === 'confirm') {
                deleteItem(ctx)
              }
            },
            cancelButtonText: '取消',
            confirmButtonText: '删除',
            confirmButtonType: 'danger',
            width: 200,
          },
        },
        view: {
          show: true,
          text: '查看',
          order: 0,
          confirmType: false,
          props: {
            type: 'info',
            onClick(e, { row }) {
              e.stopPropagation()
              ctx.scope.viewForm.showDialog(row)
            },
          },
        },
      },
    },
    ctx.optionResult.operates
  )

  const generateButton = (
    option: CrudOperateButtonOption,
    ctx: TableDefaultSlotParams<any>
  ) => {
    if (!unRef(option.show)) {
      return null
    }

    const buttonProps: ElButtonProps = {
      ...option.props,
      onClick(e) {
        if (option.confirmType === 'messagebox') {
          const confirmOption = option.confirmProps as CrudDeleteMessageBoxProps
          ElMessageBox.confirm(
            confirmOption.message ?? '确认删除该项目？',
            confirmOption.title ?? '提示',
            {
              ...confirmOption,
              callback: (action: Action) => {
                confirmOption.callback?.(action, ctx)
              },
            }
          )
        } else {
          option.props?.onClick?.(e, ctx)
        }
      },
    }
    const $inner = <ElButton {...buttonProps}>{option.text}</ElButton>

    if (option.confirmType === false || option.confirmType === 'messagebox') {
      return $inner
    }

    const onConfirm: ElPopconfirmProps['onConfirm'] = (e: MouseEvent) => {
      ;(option.confirmProps as CrudDeleteConfirmProps)?.onConfirm?.(e, ctx)
    }
    const popconfirmProps: ElPopconfirmProps = {
      ...(option.confirmProps as ElPopconfirmProps),
      title: (option.confirmProps?.title as string) ?? '确认删除该项目？',
      onConfirm,
    }
    return (
      <ElPopconfirm {...popconfirmProps}>
        {{
          reference: () => $inner,
        }}
      </ElPopconfirm>
    )
  }

  const operateColumn: CrudOperateOption = {
    ...mergeOperate,
    columnSlots: {
      default: ctx => {
        return (
          <>
            {Object.keys(mergeOperate.buttons!)
              .sort(
                (prev, curr) =>
                  unRef(mergeOperate.buttons![prev]?.order ?? 0) -
                  unRef(mergeOperate.buttons![curr]?.order ?? 0)
              )
              .map(key => generateButton(mergeOperate.buttons![key]!, ctx))}
          </>
        )
      },
    },
  }

  return operateColumn
}
