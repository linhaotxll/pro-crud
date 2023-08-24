import { message } from 'ant-design-vue'
import { merge } from 'lodash-es'

import { ProButtonGroup } from '../ProButton'

import type {
  BuildProTableOptionResult,
  ProTableActionColumnProps,
  ProTableActions,
  ProTableEditable,
  ProTableEditableActions,
  ProTableScope,
  ProvideEditTableOptions,
} from './interface'
import type { ActionsList } from '../ProButton'

export function useAction<T extends object>(
  scope: ProTableScope<T>,
  actionColumn: ProTableActionColumnProps<T> | undefined,
  editable: ProTableEditable<T>,
  getRowKey: ProvideEditTableOptions<T>['getRowKey'],
  onSubmit: BuildProTableOptionResult<T, any>['submitEditable']
) {
  const mergedActionColumn = merge<
    ProTableActionColumnProps<T>,
    ProTableActionColumnProps<T> | undefined,
    ProTableActionColumnProps<T>
  >({ label: '操作', renderCell: true }, actionColumn, {
    columnSlots: {
      bodyCell: ctx => {
        // 合并 ProTable 操作列按钮组组
        const getMergedAction = () => {
          return merge<
            ActionsList<ProTableActions<T>>,
            ActionsList<ProTableActions<T>> | undefined
          >({}, actionColumn?.actions)
        }

        const getMergedEditAction = () => {
          return editable !== false
            ? merge<
                ActionsList<ProTableEditableActions<T>>,
                ActionsList<ProTableEditableActions<T>> | undefined
              >(
                {
                  ok: {
                    text: '确认',
                    show: true,
                    props: {
                      async onClick(_, ctx) {
                        const values = scope.getRowData(getRowKey(ctx.record))
                        if (values) {
                          const result = await onSubmit?.(values, ctx)
                          if (result) {
                            message.success('编辑成功')
                            scope.cancelEditable(getRowKey(ctx.record))
                            scope.reload()
                          }
                        }
                      },
                    },
                  },
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
        }

        const resolvedActions: ActionsList<
          ProTableEditableActions<T> | ProTableActions<T>
        > | null = ctx.editable ? getMergedEditAction() : getMergedAction()

        // 在 onClick 事件中注入 ctx
        if (resolvedActions) {
          Object.keys(resolvedActions).forEach(key => {
            if (resolvedActions[key]?.props) {
              const originClick = resolvedActions[key]!.props!.onClick
              resolvedActions[key]!.props!.onClick = e => {
                originClick?.(e, ctx)
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
