import { Button, Modal, Popconfirm, Space } from 'ant-design-vue'
import { merge } from 'lodash-es'

import { DefaultActionColumn } from './constant'

import { unRef } from '../common'

import type {
  BodyCellSlotParams,
  ProTableActionColumnProps,
  ProTableActionConfirmProps,
  ProTableActionModalProps,
  ProTableActionProps,
  ProTableActions,
  ProTableEditable,
  ProTableEditableActions,
  ProTableScope,
} from './interface'
import type { ButtonProps, PopconfirmProps } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/_util/type'

export function useAction<T extends object>(
  scope: ProTableScope,
  actionColumn: ProTableActionColumnProps<T> | undefined,
  editable: ProTableEditable<T>,
  getRowKey: (record: T) => Key
) {
  const mergedAction = merge<
    ProTableActions<T>,
    ProTableActions<T> | undefined
  >({}, actionColumn?.actions)

  const mergedEditAction =
    editable !== false
      ? merge<
          ProTableEditableActions<T>,
          ProTableEditableActions<T> | undefined
        >(
          {
            ok: { text: '确认', show: true },
            cancel: {
              text: '取消',
              show: true,
              props: {
                onClick(e, ctx) {
                  e.stopPropagation()
                  scope.cancelEditable(getRowKey(ctx.record))
                },
              },
            },
          },
          editable.actions
        )
      : null

  if (actionColumn) {
    delete actionColumn.actions
  }

  const mergedActionColumn = merge<
    ProTableActionColumnProps<T>,
    ProTableActionColumnProps<T> | undefined,
    ProTableActionColumnProps<T>
  >({ label: '操作', renderCell: true }, actionColumn, {
    columnSlots: {
      bodyCell: ctx => {
        const resolvedActions = ctx.editable
          ? mergedEditAction ?? {}
          : mergedAction
        return (
          <Space>
            {Object.keys(resolvedActions)
              .map<ProTableActionProps<T>>(key =>
                merge({}, DefaultActionColumn, resolvedActions[key])
              )
              .sort((prev, curr) => unRef(prev.order!) - unRef(curr.order!))
              .map(button => generateButton(button, ctx))}
          </Space>
        )
      },
    },
  })

  const generateButton = (
    option: ProTableActionProps<T>,
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
            option.confirmProps as ProTableActionModalProps<T>

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
      ;(option.confirmProps as ProTableActionConfirmProps<T>)?.onConfirm?.(
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

  return mergedActionColumn
}
