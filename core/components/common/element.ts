import type { ToHandles } from './interface'
import type {
  AutocompleteProps,
  AutocompleteEmits,
  CascaderProps,
  CascaderEmits,
  InputProps,
  InputEmits,
  ColProps,
  RowProps,
  FormProps,
  FormEmits,
  FormItemProps,
  TableColumnCtx,
  TableProps,
  PaginationProps,
  ButtonProps,
  ButtonEmits,
  IconProps,
} from 'element-plus'

// AutoComplete
export type ElAutoCompleteProps = Partial<
  AutocompleteProps & ToHandles<AutocompleteEmits>
>
export type ElAutoCompleteSlots = {
  default?: (ctx: { item: Record<string, any> }) => JSX.Element
  prefix?: () => JSX.Element
  suffix?: () => JSX.Element
  prepend?: () => JSX.Element
  append?: () => JSX.Element
}

// Cascader
export type ElCascaderProps = Partial<CascaderProps & ToHandles<CascaderEmits>>
// export type ElCheckboxProps = Partial<CheckboxProps & ToHandles<CheckboxEmits>>

// Input
export type ElInputProps = Partial<InputProps & ToHandles<InputEmits>>
export type ElInputSlots = {
  prefix?: () => JSX.Element
  suffix?: () => JSX.Element
  prepend?: () => JSX.Element
  append?: () => JSX.Element
}

export type ElColProps = Partial<ColProps>
export type ElRowProps = Partial<RowProps>
export type ElFormProps = Partial<FormProps & ToHandles<FormEmits>>
export type ElFormItemProps = Partial<FormItemProps>

export type ElButtonProps = Partial<ButtonProps & ToHandles<ButtonEmits>>

export type ElTableColumnProps<T> = Partial<TableColumnCtx<T>>
export type ElTableProps<T> = TableProps<T>
export type ElPaginationProps = Partial<PaginationProps>

/**
 * ElTable 事件
 */
export interface TableEmit<T> {
  select(selections: T[], row: T): void
  selectAll(selections: T[]): void
  selectionChange(selection: T[]): void

  cellMouseEnter(
    row: T,
    column: TableColumnCtx<T>,
    cell: HTMLTableCellElement,
    event: MouseEvent
  ): void
  cellMouseLeave(
    row: T,
    column: TableColumnCtx<T>,
    cell: HTMLTableCellElement,
    event: MouseEvent
  ): void
  cellClick(
    row: T,
    column: TableColumnCtx<T>,
    cell: HTMLTableCellElement,
    event: MouseEvent
  ): void
  cellDblclick(
    row: T,
    column: TableColumnCtx<T>,
    cell: HTMLTableCellElement,
    event: MouseEvent
  ): void
  cellContextmenu(
    row: T,
    column: TableColumnCtx<T>,
    cell: HTMLTableCellElement,
    event: MouseEvent
  ): void

  rowClick(row: T, column: TableColumnCtx<T>, event: PointerEvent): void
  rowDblclick(row: T, column: TableColumnCtx<T>, event: MouseEvent): void
  rowContextmenu(row: T, column: TableColumnCtx<T>, event: PointerEvent): void

  headerClick(column: TableColumnCtx<T>, event: PointerEvent): void
  headerContextmenu(column: TableColumnCtx<T>, event: PointerEvent): void

  sortChange(ctx: {
    column: TableColumnCtx<T>
    prop: string
    order: 'ascending' | 'descending' | null
  }): void

  filterChange(filters: Record<string, string[]>): void

  currentChange(currentRow: T, oldCurrentRow: T): void

  headerDragend(
    newWidth: number,
    oldWidth: number,
    column: TableColumnCtx<T>,
    event: MouseEvent
  ): void

  expandChange(row: T, expanded: T[] | boolean): void
}

// Icon
export type ElIconProps = Partial<IconProps>
