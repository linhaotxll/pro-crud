import { ReloadOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

import { ProButtonGroup } from '../ProButton'

import type {
  ProTableColumnProps,
  ProTableScope,
  ProTableToolbarActionGroup,
} from './interface'
import type { FlexProps } from 'ant-design-vue'
import type { ValueOf } from 'type-fest'
import type { VNodeChild } from 'vue'

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
            return scope.reload()
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
export const TableActionColumnOptions: ProTableColumnProps = {
  label: '操作',
  renderCell(ctx) {
    return <ProButtonGroup action={ctx.column._column.action} />
  },
}
