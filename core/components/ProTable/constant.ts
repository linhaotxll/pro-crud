import type { ProTableLoading, ToolbarOption } from './interface'
import type { ElSpaceProps } from '../common'
import type { TableInstance } from 'element-plus'
import type { InjectionKey, Ref } from 'vue'

// ElTableRef 的 key
export const ElTableRefKey = Symbol() as InjectionKey<Ref<TableInstance | null>>

export const ElTableInstanceNames = [
  'clearSelection',
  'getSelectionRows',
  'toggleRowSelection',
  'toggleAllSelection',
  'toggleRowExpansion',
  'setCurrentRow',
  'clearSort',
  'clearFilter',
  'doLayout',
  'sort',
  'scrollTo',
  'setScrollTop',
  'setScrollLeft',
] as const

export const DefaultProTableLoading: Partial<ProTableLoading> = {
  text: 'loading',
}

export const DefaultPageNumber = 1
export const DefaultPageSize = 10

// 默认 toolbar 按钮配置
export const DefaultToolbarTooltip: ToolbarOption = {
  show: true,
  order: 1,
  tooltip: { placement: 'top', show: true },
  props: {
    type: 'primary',
    circle: true,
  },
}

// toolbar 默认间距配置
export const DefaultToolbarSpace: ElSpaceProps = { size: 16 }
