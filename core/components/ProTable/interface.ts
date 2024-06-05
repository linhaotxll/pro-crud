import type { TableSlotFn, TableSlotValueKey } from './constant'
import type { InternalProTableColumnProps } from './internal'
import type {
  DataObject,
  DeepMaybeRefOrGetter,
  NamePath,
  ValueType,
} from '../common'
import type {
  ActionGroupOption,
  ActionOption,
  CustomActions,
  InternalProButtonGroupOptions,
} from '../ProButton'
import type { DictionaryCollection, DictionaryColumn } from '../ProDictionary'
import type {
  BuildFormBinding,
  BuildFormOptionResult,
  ProFormColumnOptions,
  ProFormScope,
} from '../ProForm'
import type { MaybeRefOrGetter } from '@vueuse/core'
import type { FlexProps, TableProps } from 'ant-design-vue'
import type { ColumnType } from 'ant-design-vue/es/table'
import type { FilterDropdownProps } from 'ant-design-vue/es/table/interface'
import type {
  CustomizeScrollBody,
  ExpandedRowRender,
  RenderExpandIconProps,
} from 'ant-design-vue/es/vc-table/interface'
import type { ComputedRef, MaybeRef, Ref, VNodeChild } from 'vue'

/**
 * 获取 Pro Table 数据函数
 */
export type FetchTableListRequest<Data = any, Params = any> = (
  query: FetchProTablePageListQuery<Params>
) =>
  | Promise<Data[] | FetchProTablePageListResult<Data>>
  | FetchProTablePageListResult<Data>
  | Data[]

/**
 * 分页获取数据函数返回值
 */
export type FetchProTablePageListResult<Data = any> = {
  data: Data[]
  total: number
}

export type FetchProTablePageListQuery<Params = any> = {
  page: { pageSize: number; pageNum: number }
  params?: Params
}

/**
 * Pro Table 列配置
 */
export interface ProTableColumnProps<
  Data extends DataObject = any,
  Dictionary = any,
  Collection = any
> extends DictionaryColumn<Dictionary, Collection> {
  /**
   * 是否显示列
   */
  show?: MaybeRefOrGetter<boolean>

  /**
   * 标题
   */
  label?: MaybeRefOrGetter<string>

  /**
   * 字段名
   */
  name?: MaybeRefOrGetter<NamePath>

  /**
   * 类型
   *
   * @default 'text'
   */
  type?: MaybeRefOrGetter<ValueType>

  /**
   * 列配置
   */
  columnProps?: MaybeRefOrGetter<
    DeepMaybeRefOrGetter<Omit<ColumnType<Data>, 'title' | 'dataIndex' | 'key'>>
  >

  /**
   * 搜索栏配置
   */
  search?: MaybeRefOrGetter<ProFormColumnOptions<Data, Dictionary, Collection>>

  /**
   * 自定义渲染表头
   */
  renderHeader?: MaybeRef<(ctx: RenderHeaderCellTextParams<Data>) => VNodeChild>

  /**
   * 自定义渲染单元格
   */
  renderCell?: MaybeRef<(ctx: RenderBodyCellTextParams<Data>) => VNodeChild>

  /**
   * 自定义渲染单独列筛选菜单
   */
  renderFilterDropdown?: MaybeRef<
    (ctx: RenderCustomFilterDropdown<Data>) => VNodeChild
  >

  /**
   * 自定义渲染单独列筛选图标
   */
  renderFilterIcon?: MaybeRef<
    (ctx: RenderCustomFilterIconParams<Data>) => VNodeChild
  >
}

/**
 * Pro Table 列按钮组
 */
export type ProTableActionGroup = ActionGroupOption<ProTableActions, {}>

/**
 * Pro Table 列按钮
 */
export type ProTableActions = {} & CustomActions

/**
 * Pro Table Toolbar 按钮组
 */
export type ProTableToolbarActionGroup = ActionGroupOption<
  ProTableToolbarActions,
  {}
>

/**
 * Pro Table Toolbar 按钮
 */
export type ProTableToolbarActions = {
  /**
   * 刷新按扭
   */
  reload?: MaybeRefOrGetter<ActionOption>
} & CustomActions

/**
 * buildTable option 返回值
 */
export type BuildProTableOptionResult<
  Data extends DataObject = DataObject,
  Params = any,
  Collection = any,
  SearchForm extends DataObject = DataObject,
  SearchFormSubmit = SearchForm
> = DictionaryCollection<Collection> & {
  /**
   * 数据源
   */
  data?: MaybeRefOrGetter<Data[]>

  /**
   * 获取数据请求
   */
  fetchTableData?: FetchTableListRequest<Data, Params>

  /**
   * 默认数据源
   */
  defaultData?: Data[]

  /**
   * 请求携带的额外参数，当发生变化时会自动查询
   */
  params?: MaybeRefOrGetter<Params>

  /**
   * Table props
   */
  tableProps?: MaybeRefOrGetter<
    DeepMaybeRefOrGetter<Omit<TableProps<Data>, 'components' | 'columns'>>
  >

  /**
   * TODO: 列配置
   */
  columns?: MaybeRefOrGetter<ProTableColumnProps<Data, any, Collection>[]>

  /**
   * 包裹 Flex 属性
   */
  wrapperProps?: MaybeRefOrGetter<FlexProps>

  /**
   * 自定义渲染包裹元素
   */
  renderWrapper?: MaybeRef<RenderWrapperFn>

  /**
   * 操作列配置
   */
  action?: MaybeRefOrGetter<ProTableActionGroup>

  /**
   * toolbar 配置
   */
  toolbar?: MaybeRefOrGetter<ProTableToolbarActionGroup>

  /**
   * 是否需要首次触发请求
   *
   * @default true
   */
  immediate?: boolean

  /**
   * 搜索栏配置
   *
   * @default {}
   */
  search?: MaybeRefOrGetter<
    ProTableSearchOptions<Collection, SearchForm, SearchFormSubmit>
  >

  /**
   * 对获取的数据进行处理
   */
  postData?: (data: Data[]) => Data[]

  /**
   * loading 被修改时触发，一般是网络请求导致的
   */
  onLoadingChange?: (loading: boolean) => void

  /**
   * 数据加载完成后触发,会多次触发
   */
  onLoad?: (dataSource: Data[]) => void

  /**
   * Table 的数据发生改变时触发
   */
  onDataSourceChange?: (dataSource: Data[]) => void

  /**
   * 数据加载失败时触发
   */
  onRequestError?: (error: any) => void

  /**
   * 渲染 Table
   */
  renderTable?(): VNodeChild

  /**
   * 渲染 Table Header Wrapper
   */
  renderHeaderWrapper?(): VNodeChild

  /**
   * 渲染 Table Header Row
   */
  renderHeaderRow?(): VNodeChild

  /**
   * 渲染 Table Header Cell
   */
  renderHeaderCell?(): VNodeChild

  /**
   * 渲染 Table Body
   */
  renderBody?: CustomizeScrollBody<Data>

  /**
   * 渲染 Table Body Wrapper
   */
  renderBodyWrapper?(): VNodeChild

  /**
   * 渲染 Table Body Row
   */
  renderBodyRow?(): VNodeChild

  /**
   * 渲染 Table Body Cell
   */
  renderBodyCell?(): VNodeChild

  /**
   * 渲染空数据时的显示内容
   */
  renderEmptyText?: MaybeRef<() => VNodeChild>

  /**
   * 渲染总结栏
   */
  renderSummary?: MaybeRef<() => VNodeChild>

  /**
   * 渲染表格标题
   */
  renderTitle?: MaybeRef<(currentPageData: Data[]) => VNodeChild>

  /**
   * 渲染表格尾部
   */
  renderFooter?: MaybeRef<(currentPageData: Data[]) => VNodeChild>

  /**
   * 渲染展开图标
   */
  renderExpandIcon?(props: RenderExpandIconProps<Data>): VNodeChild

  /**
   * 渲染展开列表头
   */
  renderExpandColumnTitle?(): VNodeChild

  /**
   * 渲染额外展开行
   */
  renderExpandedRow?(props: Parameters<ExpandedRowRender<Data>>[0]): VNodeChild

  /**
   * 自定义渲染通用列筛选菜单
   */
  renderFilterDropdown?: MaybeRef<
    (ctx: RenderCustomFilterDropdown<Data>) => VNodeChild
  >

  /**
   * 自定义渲染通用列筛选图标
   */
  renderFilterIcon?: MaybeRef<
    (ctx: RenderCustomFilterIconParams<Data>) => VNodeChild
  >
}

/**
 * 渲染包裹元素
 */
export type RenderWrapperFn = (dom: VNodeChild) => VNodeChild

/**
 * 渲染筛选 Icon 图表的参数
 */
export interface RenderCustomFilterIconParams<
  Data extends DataObject = DataObject
> {
  filtered: boolean
  column: InternalProTableColumnProps<Data>
}

/**
 * 渲染筛选内容的参数
 */
export interface RenderCustomFilterDropdown<
  Data extends DataObject = DataObject
> extends Omit<FilterDropdownProps<Data>, 'column'> {
  column: InternalProTableColumnProps<Data>
}

/**
 * 渲染 Cell Text 参数
 */
export type RenderBodyCellTextParams<Data extends DataObject = DataObject> = {
  text: any
  value: any
  record: Data
  index: number
  column: InternalProTableColumnProps<Data>
}

/**
 * 渲染 Header Cell Text 参数
 */
export type RenderHeaderCellTextParams<Data extends DataObject = DataObject> = {
  title: any
  column: InternalProTableColumnProps<Data>
}

/**
 * Table Search 配置
 */
export type ProTableSearchOptions<
  Collection = any,
  SearchForm extends DataObject = DataObject,
  SearchFormSubmit = SearchForm
> =
  | false
  | Omit<
      BuildFormOptionResult<SearchForm, SearchFormSubmit, Collection>,
      'columns'
    >
  | ((
      scope: ProFormScope<SearchForm>
    ) => Omit<
      BuildFormOptionResult<SearchForm, SearchFormSubmit, Collection>,
      'columns'
    >)

// export type ProTableEditable<T> = false | ProTableEditableOptions<T>

// /**
//  * ProTable 编辑配置
//  */
// export interface ProTableEditableOptions<T> {
//   type?: 'cell' | 'single' | 'multiple'

//   /**
//    * 编辑模式下的操作
//    */
//   actions?: ActionsList<ProTableEditableActions<T>>

//   /**
//    * 编辑成功提示
//    *
//    * @default '编辑成功'
//    */
//   toast?: SuccessToastOptions
// }

// /**
//  * 编辑模式下操作
//  */
// export interface ProTableEditableActions<T> {
//   /**
//    * 确认按钮配置
//    */
//   ok?: ProTableActionProps<T>

//   /**
//    * 取消按钮配置
//    */
//   cancel?: ProTableActionProps<T>
// }

// export interface ProvideEditTableOptions<T> extends ProTableEditableOptions<T> {
//   editRowKeys: Ref<Key[]>
//   values: Record<string, any>

//   getRowKey(record: T): Key
// }

/**
 * ProTable 作用域
 */
export interface ProTableScope<Data extends DataObject = DataObject> {
  /**
   * 重新加载当前页数据
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

  // /**
  //  * 获取 ATable ref
  //  */
  // getTableRef(): Ref<any>

  // /**
  //  * 开始编辑
  //  *
  //  * @param rowKey 需要编辑的行 id，使用 rowKey
  //  */
  // startEditable(rowKey: Key): void

  // /**
  //  * 取消编辑
  //  *
  //  * @param rowKey 需要编辑的行 id，使用 rowKey
  //  */
  // cancelEditable(rowKey: Key): void

  // /**
  //  * 检测是否处于编辑状态
  //  * @param rowKey
  //  * @param columnName
  //  */
  // validateEditable(rowKey: Key): boolean

  // /**
  //  * 获取行数据
  //  * @param rowKey
  //  */
  // getRowData(rowKey: Key): T | undefined

  // /**
  //  * 设置行数据
  //  * @param rowKey
  //  * @param data
  //  */
  // setRowData(rowKey: Key, data: Partial<T>): void
}

export interface BuildTableResult<Data = any> {
  proTableBinding: BuildTableBinding<Data>
}

export interface BuildTableBinding<
  Data = any,
  SearchForm extends DataObject = DataObject
> {
  tableProps: ComputedRef<TableProps<Data>> | undefined
  tableSlots: ComputedRef<Record<TableSlotValueKey, TableSlotFn> | null>
  wrapperProps: ComputedRef<FlexProps>
  renderWrapper: RenderWrapperFn | ComputedRef<RenderWrapperFn> | undefined
  toolbar: Ref<InternalProButtonGroupOptions>
  search: ComputedRef<InternalProTableSearchOptions<SearchForm>>
}

/**
 * 解析好的 ProTable Search 配置
 *
 * @internal
 */
export type InternalProTableSearchOptions<
  SearchForm extends DataObject = DataObject
> = false | BuildFormBinding<SearchForm>
