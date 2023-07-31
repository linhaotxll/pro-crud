import type { ProTableLoading } from './interface'

export const ProTableInstanceNames = [
  'reload',
  'reset',
  'previous',
  'next',
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
