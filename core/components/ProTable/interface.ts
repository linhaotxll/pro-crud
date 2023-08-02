import type {
  ElIconProps,
  ElPaginationProps,
  ElTableColumnProps,
  ElTableProps,
  TableEmit,
} from '../common'
import type { ExtractMaybeRef, MaybeRef, ToHandles } from '../common/interface'
import type { TableColumnCtx, TableProps } from 'element-plus'
import type { CSSProperties, ComputedRef, Ref } from 'vue'

/**
 * Table Props 中可能是 ref 的属性
 */
export type TableMaybeRefProps<T> = Omit<
  ElTableProps<T>,
  'data' | 'defaultExpandAll' | 'defaultSort'
>

/**
 * ProTable 接受的 props
 */
export type ProTableProps<T extends object> = BuildProTableBinding<T>

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

/**
 * 获取数据函数
 */
export type FetchTableListRequest<T extends object> = (
  query: FetchTableListQuery
) => Promise<FetchTableDataResult<T>> | FetchTableDataResult<T>

/**
 * 获取数据函数参数
 */
export type FetchTableListQuery = {
  page: {
    pageNumber: number
    pageSize: number
  }
}

/**
 * 获取数据函数返回值
 */
export type FetchTableDataResult<T> = {
  data: T[]
  total: number
}

/**
 * ProTable 组件实例方法
 */
export type ProTableInstance<T> = ProTableScope<T>

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
}

/**
 * @internal
 */
export interface InternalProTableColumnProps<T> {
  columnProps: ElTableColumnProps<T>
  columnSlots: ProTableColumnProps<T>['columnSlots']
}

/**
 * buildTable 返回值
 */
export type BuildProTableResult<T extends object> = {
  proTableRef: Ref<ProTableInstance<T> | null>
  proTableBinding: BuildProTableBinding<T>
}

/**
 * buildTable option 返回值
 */
export type BuildProTableOptionResult<T extends object> = {
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

  /**
   * toolbar 配置
   */
  toolbar?: ProTableToolbarOption

  /**
   * 请求配置
   */
  request?: {
    /**
     * 获取数据请求
     */
    fetchTableData?: FetchTableListRequest<T>
  }
}

/**
 * buildTable 返回需要绑定的 props
 */
export interface BuildProTableBinding<T extends object> {
  pagination: ComputedRef<false | ElPaginationProps>
  tableProps: ComputedRef<TableProps<T>>
  tableSlots: TableSlots | undefined
  loading: ComputedRef<ProTableLoading>
  columns: ComputedRef<InternalProTableColumnProps<T>>[]
  scope: ProTableScope<T>
  toolbar: ComputedRef<InternalProTableToolbarOption>
}

/**
 * ProTable 作用域
 */
export interface ProTableScope<T> {
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
 * Table 插槽
 */
interface TableSlots {
  empty?(): JSX.Element
  append?(): JSX.Element
}

/**
 * toolbar 配置
 */
export interface ProTableToolbarOption {
  /**
   * 是否显示
   */
  show?: MaybeRef<boolean>

  /**
   * 操作列表
   */
  list?: {
    /**
     * 刷新按钮
     */
    reload?: ToolbarOption

    /**
     * 导出按钮
     */
    export?: ToolbarOption

    /**
     * 其他
     */
    [type: string]: ToolbarOption | undefined
  }
}

/**
 * toolbar 按钮配置
 */
export interface ToolbarOption {
  /**
   * 是否显示操作
   */
  show?: MaybeRef<boolean>

  /**
   * toolbar className
   */
  class?: MaybeRef<string | string[] | Record<string, boolean>>

  /**
   * toolbar 样式
   */
  style?: MaybeRef<string | CSSProperties>

  /**
   * 优先级，越高越靠前
   */
  order?: MaybeRef<number>

  /**
   * 图标名
   */
  icon: string

  /**
   * 是否需要背景色
   */
  background: MaybeRef<false | string>

  /**
   * icon 配置
   */
  props?: ElIconProps & { onClick?: (e: MouseEvent) => void }

  /**
   * 自定义渲染操作
   */
  render?: () => JSX.Element
}

export interface InternalProTableToolbarOption {
  show: boolean
  list: ToolbarOption[]
  style?: string | CSSProperties
  class?: string | string[] | Record<string, boolean>
}
