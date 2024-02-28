import { merge } from 'lodash-es'
import { inject } from 'vue'

import { ConfirmDeleteContent, DeleteRecordToast } from './constant'

import { showToast } from '../Toast'

import { GlobalOption } from '~/constant'

import type { BuildCrudContext, CrudActionOption } from './interface'
import type { BodyCellSlotParams, ProTableActionColumnProps } from '../ProTable'

export function useOperate<
  T extends object,
  R extends object,
  S extends object,
  S1 extends object,
  A extends object,
  E extends object
>(ctx: BuildCrudContext<T, R, S, S1, A, E>) {
  async function deleteItem(options: BodyCellSlotParams<T>) {
    const response = await ctx.optionResult.deleteRequest?.(options)

    if (response) {
      ctx.scope.table.reload()
      showToast(ctx.optionResult.deleteToast ?? DeleteRecordToast)
    }
  }

  const mergeOperate: ProTableActionColumnProps<T> = merge<
    ProTableActionColumnProps<T>,
    CrudActionOption<T> | undefined,
    CrudActionOption<T> | undefined
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
            title: ConfirmDeleteContent,
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
    inject(GlobalOption)?.crud?.action,
    ctx.optionResult.table?.action ?? ctx.optionResult.action
  )

  return mergeOperate
}
