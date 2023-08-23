import { merge } from 'lodash-es'

import { ProButtonGroup } from '../ProButton'

import type {
  ProTableActionColumnProps,
  ProTableActions,
  ProTableEditable,
  ProTableEditableActions,
  ProTableScope,
} from './interface'
import type { ActionsList } from '../ProButton'
import type { Key } from 'ant-design-vue/es/_util/type'

export function useAction<T extends object>(
  scope: ProTableScope,
  actionColumn: ProTableActionColumnProps<T> | undefined,
  editable: ProTableEditable<T>,
  getRowKey: (record: T) => Key
) {
  // 合并 ProTable 操作列按钮组组
  const mergedAction: ActionsList<ProTableActions<T>> = merge<
    ActionsList<ProTableActions<T>>,
    ActionsList<ProTableActions<T>> | undefined
  >({}, actionColumn?.actions)

  // 合并 ProTable 编辑操作列按钮组
  const mergedEditAction: ActionsList<ProTableEditableActions<T>> | null =
    editable !== false
      ? merge<
          ActionsList<ProTableEditableActions<T>>,
          ActionsList<ProTableEditableActions<T>> | undefined
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
        const resolvedActions: ActionsList<
          ProTableEditableActions<T> | ProTableActions<T>
        > | null = ctx.editable ? mergedEditAction : mergedAction

        // 在 onClick 事件中注入 ctx
        if (resolvedActions) {
          Object.keys(resolvedActions).forEach(key => {
            const originClick = resolvedActions[key]?.props?.onClick
            if (originClick) {
              resolvedActions[key]!.props!.onClick = e => {
                originClick(e, ctx)
              }
            }
          })
        }

        return <ProButtonGroup actions={resolvedActions as any} />
      },
    },
  })

  return mergedActionColumn
}
