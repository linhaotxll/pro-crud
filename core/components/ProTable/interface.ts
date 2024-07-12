import type { TableSlotFn, TableSlotValueKey } from './constant'
import type {
  InternalProTableColumnProps,
  InternalProTableEditableOptions,
} from './internal'
import type { DataObject, NamePath, ValueType } from '../common'
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
import type { ToastOptions } from '../Toast'
import type { DeepMaybeRef } from '@vueuse/core'
import type { FlexProps, TableProps } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { ColumnType } from 'ant-design-vue/es/table'
import type { FilterDropdownProps } from 'ant-design-vue/es/table/interface'
import type {
  CustomizeScrollBody,
  ExpandedRowRender,
  RenderExpandIconProps,
} from 'ant-design-vue/es/vc-table/interface'
import type {
  ComputedRef,
  MaybeRef,
  MaybeRefOrGetter,
  Ref,
  VNodeChild,
} from 'vue'

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
    DeepMaybeRef<Omit<ColumnType<Data>, 'title' | 'dataIndex' | 'key'>>
  >

  /**
   * 表单公共配置
   */
  form?: MaybeRefOrGetter<
    Omit<
      ProFormColumnOptions<Data, Dictionary, Collection>,
      'dict' | 'type' | 'name'
    >
  >

  /**
   * 搜索栏配置
   */
  search?: MaybeRefOrGetter<
    Omit<ProFormColumnOptions<Data, Dictionary, Collection>, 'dict' | 'type'>
  >

  /**
   * 是否可编辑
   *
   * @default false
   */
  editable?: boolean | ((ctx: RenderBodyCellTextParams<Data>) => boolean)

  /**
   * 编辑表单列配置
   */
  editableForm?: MaybeRefOrGetter<
    Omit<
      ProFormColumnOptions<Data, Dictionary, Collection>,
      'dict' | 'type' | 'name'
    >
  >

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
export type ProTableColumnActionGroup<C = any> = ActionGroupOption<
  ProTableActions<C>,
  {}
>

/**
 * Pro Table 列按钮
 */
export interface ProTableActions<C = any> {
  /**
   * 开始编辑按钮
   */
  edit?: MaybeRefOrGetter<ActionOption<C>>

  /**
   * 自定义按钮
   */
  [name: string]: MaybeRefOrGetter<ActionOption<C>> | undefined
}

/**
 * Pro Table 编辑按钮组
 */
export type ProTableEditableColumnActionGroup<
  Data extends DataObject = DataObject
> = ActionGroupOption<
  ProTableEditableActions<RenderBodyCellTextParams<Data>>,
  {}
>

/**
 * Pro Table 编辑列按钮
 */
export type ProTableEditableActions<C = any> = {
  /**
   * 保存
   */
  save?: MaybeRefOrGetter<ActionOption<C>>

  /**
   * 取消编辑
   */
  cancel?: MaybeRefOrGetter<ActionOption<C>>

  /**
   * 自定义按钮
   */
  [name: string]: MaybeRefOrGetter<ActionOption<C>> | undefined
}

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

export type ProTableActionColumn<
  Data extends DataObject = DataObject,
  Collection = any
> =
  | ProTableColumnProps<Data, null, Collection> & {
      action?: ProTableColumnActionGroup<RenderBodyCellTextParams<Data>>
    }

/**
 * buildTable 参数
 */
export type BuildTableOption<
  Data extends DataObject = DataObject,
  Params = any,
  Collection = any,
  SearchForm extends DataObject = DataObject
> = (
  scope: ProTableScopeWithSearch<Data>
) => BuildProTableOptionResult<Data, Params, Collection, SearchForm>

/**
 * buildTable option 返回值
 */
export type BuildProTableOptionResult<
  Data extends DataObject = DataObject,
  Params = any,
  Collection = any,
  SearchForm extends DataObject = DataObject
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
    DeepMaybeRef<
      Omit<
        TableProps<Data>,
        'components' | 'columns' | 'dataSource' | 'loading'
      >
    >
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
   *
   * @default { show: false }
   */
  actionColumn?: MaybeRefOrGetter<ProTableActionColumn<Data, Collection>>

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
  search?: MaybeRefOrGetter<ProInnerFormOptions<SearchForm, Collection>>

  /**
   * 编辑表格配置
   *
   * @default false
   */
  editable?: MaybeRefOrGetter<ProTableEditableOptions | false>

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
  renderTable?: MaybeRef<() => VNodeChild>

  /**
   * 渲染 Table Header Wrapper
   */
  renderHeaderWrapper?: MaybeRef<() => VNodeChild>

  /**
   * 渲染 Table Header Row
   */
  renderHeaderRow?: MaybeRef<() => VNodeChild>

  /**
   * 渲染 Table Header Cell
   */
  renderHeaderCell?: MaybeRef<() => VNodeChild>

  /**
   * 渲染 Table Body
   */
  renderBody?: MaybeRef<CustomizeScrollBody<Data>>

  /**
   * 渲染 Table Body Wrapper
   */
  renderBodyWrapper?: MaybeRef<() => VNodeChild>

  /**
   * 渲染 Table Body Row
   */
  renderBodyRow?: MaybeRef<() => VNodeChild>

  /**
   * 渲染 Table Body Cell
   */
  renderBodyCell?: MaybeRef<() => VNodeChild>

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
  renderExpandIcon?: MaybeRef<
    (props: RenderExpandIconProps<Data>) => VNodeChild
  >

  /**
   * 渲染展开列表头
   */
  renderExpandColumnTitle?: MaybeRef<() => VNodeChild>

  /**
   * 渲染额外展开行
   */
  renderExpandedRow?: MaybeRef<
    (props: Parameters<ExpandedRowRender<Data>>[0]) => VNodeChild
  >

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
 * 内部表单配置
 */
export type ProInnerFormOptions<
  FormState extends DataObject = DataObject,
  Collection = any
> =
  | false
  | Omit<BuildFormOptionResult<FormState, FormState, Collection>, 'columns'>
  | ((
      scope: ProFormScope<FormState>
    ) => Omit<
      BuildFormOptionResult<FormState, FormState, Collection>,
      'columns'
    >)

export type EditableKeys = (Key | [Key, NamePath[]])[]

/**
 * Table 编辑配置
 */
export interface ProTableEditableOptions<
  Data extends DataObject = DataObject,
  Collection = any
> {
  /**
   * 编辑类型
   *
   * @default 'single'
   */
  type?: 'single' | 'multiple'

  /**
   * 编辑模式下的操作列按钮组配置
   */
  action?: ProTableEditableColumnActionGroup<RenderBodyCellTextParams<Data>>

  /**
   * 正在编辑的行，受控属性
   *
   * [1, 2, 3]
   * [
   *  [1, ['name']],
   *  [2, ['age']],
   * ]
   */
  editableKeys?: MaybeRefOrGetter<EditableKeys>

  /**
   * 编辑表单配置
   */
  form?:
    | Omit<BuildFormOptionResult<Data, Data, Collection>, 'columns'>
    | ((
        scope: ProFormScope<Data>
      ) => Omit<BuildFormOptionResult<Data, Data, Collection>, 'columns'>)

  /**
   * 保存请求
   */
  saveRequest?: (
    data: Partial<Data>,
    ctx: RenderBodyCellTextParams<Data>
  ) => Promise<boolean> | boolean

  /**
   * 保存成功 toast
   */
  saveToast?: MaybeRefOrGetter<ToastOptions>

  /**
   * 只能编辑一行的的提示
   */
  onlyEditOneLineToast?: MaybeRefOrGetter<ToastOptions>
}

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

  /**
   * 开始编辑
   *
   * @param {Key} rowKey rowId 或者索引
   * @param {NamePath} columnName 列名称，仅在 type 是 cell 下有效
   */
  startEdit: (rowKey: Key, columnName?: NamePath[]) => void

  /**
   * 取消编辑
   *
   * @param {Key} rowKey rowId 或者索引
   * @param {NamePath} columnName 列名称，仅在 type 是 cell 下有效
   */
  cancelEdit: (rowKey: Key, columnName?: NamePath[]) => void

  /**
   * 获取一行的编辑数据
   */
  getEditableRowData(rowKey: Key): Data | undefined

  /**
   * 获取整个 table 编辑的数据
   */
  getEditableRowsData(): Data[] | null

  /**
   * 设置一行编辑的数据
   */
  setEditableRowData(rowKey: Key, data: Partial<Data>): void

  /**
   * 清空一行编辑的数据
   */
  clearEditableRowData(rowKey: Key): void
}

export interface ProTableScopeWithSearch<Data extends DataObject = DataObject> {
  search: ProFormScope
  table: ProTableScope<Data>
}

export interface BuildTableResult<Data extends DataObject = any> {
  proTableBinding: BuildTableBinding<Data>
}

export interface BuildTableBinding<
  Data extends DataObject = any,
  SearchForm extends DataObject = DataObject
> {
  tableProps: ComputedRef<TableProps<Data>> | undefined
  tableSlots: ComputedRef<Record<TableSlotValueKey, TableSlotFn> | null>
  wrapperProps: ComputedRef<FlexProps>
  renderWrapper: RenderWrapperFn | ComputedRef<RenderWrapperFn> | undefined
  toolbar: Ref<InternalProButtonGroupOptions>
  search: InternalProTableSearchOptions<SearchForm>
  editable: ComputedRef<InternalProTableEditableOptions<any>>
}

/**
 * 解析好的 ProTable Search 配置
 *
 * @internal
 */
export type InternalProTableSearchOptions<
  SearchForm extends DataObject = DataObject
> = BuildFormBinding<SearchForm>
