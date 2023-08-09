import { ElButton, ElMessage, ElMessageBox, ElPopconfirm } from 'element-plus'
import { merge } from 'lodash-es'

import { DefaultOperateButton } from './constant'

import { unRef } from '../common'

import type {
  CrudTableOperateProps,
  BuildCrudContext,
  CrudTableOperateButtonProps,
  CrudTableOperateConfirmProps,
  CrudDeleteMessageBoxProps,
} from './interface'
import type { ElButtonProps, ElPopconfirmProps } from '../common'
import type { TableDefaultSlotParams } from '../ProTable'
import type { Action } from 'element-plus'

export function useOperate(ctx: BuildCrudContext<any>) {
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

  const mergeOperate: CrudTableOperateProps = merge<
    CrudTableOperateProps,
    CrudTableOperateProps | undefined
  >(
    {
      label: '操作',
      prop: 'operate',
      buttons: {
        edit: {
          show: true,
          text: '编辑',
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
    option: CrudTableOperateButtonProps,
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
      ;(option.confirmProps as CrudTableOperateConfirmProps)?.onConfirm?.(
        e,
        ctx
      )
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

  const operateColumn: CrudTableOperateProps = {
    ...mergeOperate,
    columnSlots: {
      default: ctx => {
        return (
          <>
            {Object.keys(mergeOperate.buttons!)
              .map(key =>
                merge({}, DefaultOperateButton, mergeOperate.buttons![key])
              )
              .sort((prev, curr) => unRef(prev.order!) - unRef(curr.order!))
              .map(button => generateButton(button, ctx))}
          </>
        )
      },
    },
  }

  return operateColumn
}
