import type { ProTableLoading } from './interface'
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
