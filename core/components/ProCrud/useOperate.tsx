import { Button, Modal, Popconfirm, Space, message } from 'ant-design-vue'
import { merge } from 'lodash-es'

import { DefaultOperateButton } from './constant'

import { unRef } from '../common'

import type {
  CrudTableOperateProps,
  BuildCrudContext,
  CrudTableOperateButtonProps,
  CrudTableOperateConfirmProps,
  CrudTableOperateModalProps,
} from './interface'
import type { BodyCellSlotParams } from '../ProTable'
import type { ButtonProps, PopconfirmProps } from 'ant-design-vue'

export function useOperate<
  T extends object,
  R extends object,
  S extends object,
  S1 extends object,
  A extends object,
  E extends object
>(ctx: BuildCrudContext<T, R, S, S1, A, E>) {
  async function deleteItem(options: BodyCellSlotParams<T>) {
    const response = await ctx.optionResult.request?.deleteRequest?.(options)

    if (response) {
      ctx.scope.table.reload()
      message.success('删除成功')
    }
  }

  const mergeOperate: CrudTableOperateProps<T> = merge<
    CrudTableOperateProps<T>,
    CrudTableOperateProps<T> | undefined
  >(
    {
      label: '操作',
      name: 'operate',
      renderCell: true,
      buttons: {
        edit: {
          show: true,
          text: '编辑',
          order: 1,
          props: {
            type: 'primary',
            onClick(e, { record }) {
              e.stopPropagation()
              ctx.scope.editForm.showDialog(record)
            },
          },
        },
        delete: {
          show: true,
          text: '删除',
          order: 2,
          props: {
            danger: true,
            type: 'primary',
            onClick(e, ctx) {
              e.stopPropagation()
              return deleteItem(ctx)
            },
          },
          confirmType: 'modal',
          confirmProps: {
            onConfirm(e, ctx) {
              e.stopPropagation()
              return deleteItem(ctx)
            },
            onOk: deleteItem,
            cancelText: '取消',
            okText: '删除',
            okType: 'danger',
          },
        },
        view: {
          show: true,
          text: '查看',
          order: 0,
          props: {
            type: 'default',
            onClick(e, { record }) {
              e.stopPropagation()
              ctx.scope.viewForm.showDialog(record)
            },
          },
        },
      },
      columnProps: { width: 250 },
    },
    ctx.optionResult.operates
  )

  const generateButton = (
    option: CrudTableOperateButtonProps<T>,
    ctx: BodyCellSlotParams<any>
  ) => {
    if (!unRef(option.show)) {
      return null
    }

    const buttonProps: ButtonProps = {
      ...option.props,
      onClick(e) {
        const { confirmType } = option
        if (confirmType === 'modal') {
          const confirmOption =
            option.confirmProps as CrudTableOperateModalProps<T>
          Modal.confirm({
            ...confirmOption,
            title: confirmOption.title ?? '确认删除该项目？',
            onOk(...args: unknown[]) {
              console.log('modal ok: ', ...args)
              confirmOption.onOk?.apply(null, [ctx])
            },
          })
        } else if (confirmType === false) {
          option.props?.onClick?.(e, ctx)
        }
      },
    }

    const $inner = <Button {...buttonProps}>{option.text}</Button>

    if (option.confirmType === false || option.confirmType === 'modal') {
      return $inner
    }

    const onConfirm: PopconfirmProps['onConfirm'] = (e: MouseEvent) => {
      ;(option.confirmProps as CrudTableOperateConfirmProps<T>)?.onConfirm?.(
        e,
        ctx
      )
    }
    const popconfirmProps: PopconfirmProps = {
      ...(option.confirmProps as PopconfirmProps),
      title: (option.confirmProps?.title as string) ?? '确认删除该项目？',
      onConfirm,
    }
    return (
      <Popconfirm {...popconfirmProps}>
        {{
          default: () => $inner,
        }}
      </Popconfirm>
    )
  }

  const operateColumn: CrudTableOperateProps<T> = {
    ...mergeOperate,
    columnSlots: {
      bodyCell: ctx => {
        // console.log('mergeOperate: ', mergeOperate.buttons)
        return (
          <Space>
            {Object.keys(mergeOperate.buttons!)
              .map(key =>
                merge({}, DefaultOperateButton, mergeOperate.buttons![key])
              )
              .sort((prev, curr) => unRef(prev.order!) - unRef(curr.order!))
              .map(button => generateButton(button, ctx))}
          </Space>
        )
      },
    },
  }

  return operateColumn
}
