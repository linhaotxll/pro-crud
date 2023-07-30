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
export type ProTableProps<T> = {
  /**
   * 数据源(不推荐)
   */
  data?: MaybeRef<T[]>

  /**
   * ElTable props
   */
  tableProps?: TableMaybeRefProps<T> & {
    defaultExpandAll?: ElTableProps<T>['defaultExpandAll']
    defaultSort?: ElTableProps<T>['defaultSort']
  }

  tableSlots?: TableSlots
  /**
   * 初始页数
   *
   * @default 1
   */
  initialPageNumber?: number

  /**
   * 每一页个数，优先级高于分页的 pageSize
   *
   * @default 10
   */
  pageSize?: MaybeRef<number>

  /**
   * 获取数据请求
   */
  fetchTableData?: (
    pageNumber: number,
    pageSize: number
  ) => FetchTableDataResult<T>

  /**
   * 分页配置，false 不显示
   */
  pagination?: MaybeRef<false | ElPaginationProps>

  /**
   * 列配置
   */
  columns?: ExtractMaybeRef<ProTableColumnProps<T>>[]
}

export type ResolvedProTableProps<T> = Omit<
  ProTableProps<T>,
  'initialPageNumber' | 'pageSize'
> & {
  initialPageNumber: number

  pageSize: MaybeRef<number>
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
export interface ProTableInstance {
  /**
   * 重新加载指定页数数据，默认加载当前页数
   */
  reload(pageNumber?: number): Promise<void>

  /**
   * 调回第 1 页重新加载
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
}

export type UseTableReturn<T> = {
  /**
   * 解析好的分页配置
   */
  resolvedPagination: ComputedRef<false | ElPaginationProps>

  resolvedColumns: ComputedRef<ElTableColumnProps<T>>[]

  tableProps: ComputedRef<ElTableProps<T>>

  tableSlots: TableSlots | undefined
}

/**
 * 列配置
 */
export type ProTableColumnProps<T> = {
  /**
   * 列配置
   */
  columnProps?: ExtractMaybeRef<Omit<ElTableColumnProps<T>, 'label' | 'prop'>>

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
  label?: string

  /**
   * 字段名
   */
  prop: string
}

export type BuildProTableResult<T> = {
  proTableRef: Ref<ProTableInstance | null>
  tableBinding: ProTableBinding<T>
}

export type ProTableBinding<T> = {}

export interface ProTableScope<T> {
  //
  name: string
}

export interface TableEmit<T> {
  select(): void
}

interface TableSlots {
  empty?(): JSX.Element
  append?(): JSX.Element
}
