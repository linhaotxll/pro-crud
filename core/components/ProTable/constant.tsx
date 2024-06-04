import { ReloadOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

import type { ProTableScope, ProTableToolbarActionGroup } from './interface'
import type { ValueOf } from 'type-fest'
import type { VNodeChild } from 'vue'

// 获取默认 toolbar
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
} as const

export type TableSlotKey = keyof typeof tableSlotKey
export type TableSlotValueKey =
  | ValueOf<typeof tableSlotKey>
  | 'bodyCell'
  | 'headerCell'
export type TableSlotFn = (...args: any[]) => VNodeChild
