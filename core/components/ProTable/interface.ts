import type { ExtractMaybeRef, MaybeRef, ToHandles } from '../common/interface'
import type { PaginationProps, TableColumnCtx, TableProps } from 'element-plus'
import type { ComputedRef, Ref } from 'vue'

export type ElTableColumnProps<T> = Partial<TableColumnCtx<T>>
export type ElTableProps<T> = TableProps<T>
export type ElPaginationProps = Partial<PaginationProps>
/**
 * Table Props 中可能是 ref 的属性
 */
export type TableMaybeRefProps<T> = Omit<
  ElTableProps<T>,
  'data' | 'defaultExpandAll' | 'defaultSort'
>

/**
 * ProTable props
 */
export type ProTableProps<T extends object> = {
  /**
   * 数据源(不推荐)
   */
  data?: MaybeRef<T[]>

  /**
   * ElTable props
   */
  tableProps?: ExtractMaybeRef<TableMaybeRefProps<T>> & {
    defaultExpandAll?: ElTableProps<T>['defaultExpandAll']
    defaultSort?: ElTableProps<T>['defaultSort']
  } & Partial<ToHandles<TableEmit<T>>>

  /**
   * ElTable 插槽
   */
  tableSlots?: TableSlots

  /**
   * 获取数据请求
   */
  fetchTableData?: FetchTableListRequest<T>

  /**
   * 分页配置，false 不显示
   */
  pagination?: MaybeRef<
    false | Omit<ElPaginationProps, 'pageSize' | 'currentPage' | 'total'>
  >

  /**
   * 列配置
   */
  columns?: ProTableColumnProps<T>[]

  /**
   * loading 配置
   */
  loading?: MaybeRef<ExtractMaybeRef<Omit<ProTableLoading, 'visible'>>>

  // /**
  //  * 编辑配置
  //  */
  // editable?: {
  //   /**
  //    * 编辑类型：单元格编辑/行编辑
  //    */
  //   type: 'cell' | 'row'

  //   /**
  //    * 单元格编辑请求
  //    */
  //   cellEditRequest?(): Promise<void>

  //   /**
  //    * 行编辑请求
  //    */
  //   rowEditRequest?(): Promise<void>
  // }
}

/**
 * ProTable Loading 配置
 */
export interface ProTableLoading {
  visible: boolean
  text?: string
  background?: string
  spinner?: string
  svg?: string
}

export type FetchTableListRequest<T extends object> = (
  query: FetchTableListQuery
) => Promise<FetchTableDataResult<T>> | FetchTableDataResult<T>

export type FetchTableListQuery = {
  page: {
    pageNumber: number
    pageSize: number
  }
}

/**
 * 表格请求接口返回数据
 */
export type FetchTableDataResult<T> = {
  data: T[]
  total: number
}

/**
 * ProTable 组件实例方法
 */
export interface ProTableInstance<T> {
  /**
   * 重新加载指定页数数据，默认加载当前页数
   */
  reload(): Promise<void>

  /**
   * 恢复默认页重新加载
   */
  reset(): Promise<void>

  /**
   * 跳转上一页
   */
  previous(): Promise<void>

  /**
   * 加载下一页
   */
  next(): Promise<void>

  /**
   * ElTable 原始方法
   */
  clearSelection(): void
  getSelectionRows(): T[] | undefined
  toggleRowSelection(row: T, selected: boolean): void
  toggleAllSelection(): void
  toggleRowExpansion(row: T, expanded: boolean | undefined): void
  setCurrentRow(row: T): void
  clearSort(): void
  clearFilter(columnKeys: string[]): void
  doLayout(): void
  sort(prop: string, order: string): void
  scrollTo(options: number | ScrollToOptions, yCoord?: number | undefined): void
  setScrollTop(top: number | undefined): void
  setScrollLeft(left: number | undefined): void
}

/**
 * 列配置
 */
export type ProTableColumnProps<T> = {
  /**
   * 列配置
   */
  columnProps?: MaybeRef<
    ExtractMaybeRef<Omit<ElTableColumnProps<T>, 'label' | 'prop'>>
  >

  /**
   * 列插槽
   */
  columnSlots?: {
    default?(ctx: {
      row: T
      column: TableColumnCtx<T>
      $index: number
    }): JSX.Element

    header?(ctx: { column: TableColumnCtx<T>; $index: number }): JSX.Element
  }

  /**
   * 标题
   */
  label?: MaybeRef<string>

  /**
   * 字段名
   */
  prop: MaybeRef<string>

  // /**
  //  * 是否可以编辑
  //  */
  // editable?:
  //   | MaybeRef<boolean>
  //   | ((option: {
  //       text: any
  //       row: T
  //       index: number
  //       column: TableColumnCtx<T>
  //     }) => boolean)
}

/**
 * @internal
 */
export interface InternalProTableColumnProps<T> {
  columnProps: ElTableColumnProps<T>

  columnSlots: ProTableColumnProps<T>['columnSlots']
}

export type BuildProTableResult<T extends object> = {
  proTableRef: Ref<ProTableInstance<T> | null>
  tableBinding: ProTableProps<T>
}

export type ProTableScope<T> = ProTableInstance<T>

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

interface TableSlots {
  empty?(): JSX.Element
  append?(): JSX.Element
}

export interface UseTableReturn<T> extends ProTableInstance<T> {
  resolvedPagination: ComputedRef<false | ElPaginationProps>

  resolvedColumns: ComputedRef<InternalProTableColumnProps<T>>[]

  tableProps: ComputedRef<TableProps<T>>

  tableSlots: TableSlots | undefined

  loadingConfig: ComputedRef<ProTableLoading>
}

// export interface ProTableEditable {
//   startEditable(rowKey: string): void
// }
