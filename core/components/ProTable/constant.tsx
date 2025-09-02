import { ReloadOutlined } from '@ant-design/icons-vue'
import { h, toValue } from 'vue'

import { getUuid, mergeWithTovalue } from '../common'
import { ProButtonGroup } from '../ProButton'
import { buildButtonGroupInRender } from '../ProButton/buildButtonGroup'

import { isFunction, isNil } from '~/utils'

import type {
  ProTableColumnActionGroup,
  ProTableColumnProps,
  ProTableEditableOptions,
  ProTableScope,
  ProTableToolbarActionGroup,
} from './interface'
import type {
  InternalColumnOptions,
  InternalEditableKeys,
  InternalProTableEditableOptions,
} from './internal'
import type { DataObject } from '../common'
import type { FlexProps, TableProps } from 'ant-design-vue'
import type { GetRowKey } from 'ant-design-vue/es/vc-table/interface'
import type { ValueOf } from 'type-fest'
import type { ComputedRef, MaybeRefOrGetter, VNodeChild } from 'vue'

/**
 * 解析默认 toolbar 配置
 *
 * 默认展示刷新按钮
 *
 *  @param {ProTableScope} scope ProTable 作用域
 * @returns toolbar 配置对象
 */
export const buildDefaultToolbar = (
  scope: ProTableScope
): ProTableToolbarActionGroup => {
  return {
    show: true,
    actions: {
      reload: {
        show: true,
        props: {
          icon: h(ReloadOutlined),
          type: 'primary',
          shape: 'circle',
          onClick() {
            return scope.table.reload()
          },
        },
      },
    },
  }
}

export const buildDefaultTableSearch: {
  show: boolean
} = {
  show: true,
  // config: {},
}

/** 以下 key 视为 slots */
export const tableSlotKey = {
  renderEmptyText: 'emptyText',
  renderSummary: 'summary',
  renderTitle: 'title',
  renderFooter: 'footer',
  renderExpandIcon: 'expandIcon',
  renderExpandColumnTitle: 'expandColumnTitle',
  renderExpandedRow: 'expandedRowRender',
  renderFilterDropdown: 'customFilterDropdown',
  renderFilterIcon: 'customFilterIcon',
} as const

export type TableSlotKey = keyof typeof tableSlotKey
export type TableSlotValueKey =
  | ValueOf<typeof tableSlotKey>
  | 'bodyCell'
  | 'headerCell'
export type TableSlotFn = (...args: any[]) => VNodeChild

/**
 * Table 最外层 Flex Props
 */
export const TableContainerProps: FlexProps = {
  vertical: true,
}

/**
 * Table 操作列配置
 */
export const buildTableActionColumnOptions = (
  action: ProTableColumnActionGroup<object> | undefined,
  resolvedEditable: ComputedRef<InternalProTableEditableOptions<any>>,
  scope: ProTableScope,
  tableProps: ComputedRef<TableProps>,
  editableKeysMap: InternalEditableKeys
): ProTableColumnProps => {
  return {
    label: '操作',
    renderCell(ctx) {
      const editableValue = toValue(resolvedEditable)

      let resolvedAction = action

      // 如果 Table 无法编辑,则使用 actionColumn 里的 action 作为按扭组
      if (editableValue !== false) {
        const rowKey = getRowKey(ctx.record, tableProps)

        // 编辑操作按扭只对 single 和 multiple 生效
        // 如果 rowKey 对应的行处于编辑模式则使用配置里的按扭组
        if (editableKeysMap.get(rowKey) === true) {
          resolvedAction = mergeWithTovalue({}, editableValue.action)
        } else {
          resolvedAction = mergeWithTovalue(
            {},
            buildTableEnableEditDefaultAction(scope, tableProps),
            action
          )
        }
      }

      return (
        <ProButtonGroup
          // @ts-ignore
          action={buildButtonGroupInRender(resolvedAction, undefined, ctx)}
        />
      )
    },
  }
}

/**
 * Table 开启编辑模式默认按钮组
 */
export function buildTableEnableEditDefaultAction(
  scope: ProTableScope,
  tableProps: MaybeRefOrGetter<TableProps>
): ProTableColumnActionGroup {
  return {
    show: true,
    actions: {
      edit: {
        show: true,
        text: '编辑',
        props: {
          onClick(_, ctx) {
            const name = ctx.column._column.name
            scope.table.startEdit(
              getRowKey(ctx.record, tableProps),
              isNil(name) ? undefined : [name]
            )
          },
        },
      },
    },
  }
}

/**
 * Table 编辑默认配置
 */
export function buildTableEditableDefaultOption(
  scope: ProTableScope,
  tableProps: MaybeRefOrGetter<TableProps>,
  editable: ComputedRef<InternalProTableEditableOptions<any>>
): ProTableEditableOptions {
  return {
    type: 'single',
    // onlyEditOneLineToast: {
    //   type: 'message',
    //   props: { content: '只能同时编辑一行', type: 'warning' },
    // },
    action: {
      show: true,
      actions: {
        save: {
          show: true,
          text: '保存',
          props: {
            onClick(_, ctx) {
              const editableValue = toValue(editable)
              if (editableValue !== false) {
                const rowKey = getRowKey(ctx.record, tableProps)
                const promise = Promise.resolve(
                  editableValue.saveRequest?.(
                    scope.table.getEditableRowData(rowKey)!,
                    ctx
                  )
                )

                promise.then(res => {
                  if (res) {
                    scope.table.cancelEdit(rowKey)
                    return scope.table.reload()
                  }
                })

                return promise
              }
            },
          },
        },
        cancel: {
          show: true,
          text: '取消',
          props: {
            onClick(_, ctx) {
              const rowKey = getRowKey(ctx.record, tableProps)
              scope.table.cancelEdit(rowKey)
            },
          },
        },
      },
    },
  }
}

export const mergeTableColumnOptions: Partial<InternalColumnOptions<any>> = {
  editable: false,
  show: true,
}

export function getRowKey<Data extends DataObject = DataObject>(
  record: Data,
  tableProps: MaybeRefOrGetter<TableProps>
) {
  const rowKeyValue = toValue(tableProps).rowKey
  if (isNil(rowKeyValue)) {
    throw new Error('rowKey is required')
  }

  const getRowKey: GetRowKey<any> = isFunction(rowKeyValue)
    ? rowKeyValue
    : (item: any) => item[rowKeyValue]

  const rowKey = getRowKey(record)
  if (isNil(rowKey)) {
    throw new Error(`rowKey is invalid`)
  }

  return rowKey
}

export const TableEditableNamePlaceholder = getUuid() + '__placeholder__'
