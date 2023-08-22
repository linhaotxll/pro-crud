import { message } from 'ant-design-vue'
import { merge } from 'lodash-es'

import type { CrudTableOperateProps, BuildCrudContext } from './interface'
import type { BodyCellSlotParams } from '../ProTable'

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
      actions: {
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
    ctx.optionResult.action
  )

  return mergeOperate
}
