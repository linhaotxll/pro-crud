// import type {
//   ValueType,
//   ColumnType,
//   DictionaryCollectionOptions,
//   ColumnDictionaryOptions,
//   useDictionary,
// } from '../common'
// import type { ExtractMaybeRef, JSXElement, MaybeRef } from '../common/interface'
// import type { ActionOption, ActionsList } from '../ProButton'
// import type { SuccessToastOptions } from '../Toast'
// import type {
//   ButtonProps,
//   ModalProps,
//   PopconfirmProps,
//   SpaceProps,
//   SpinProps,
//   TableProps,
//   TooltipProps,
// } from 'ant-design-vue'
// import type { Key } from 'ant-design-vue/es/_util/type'
// import type { SizeType } from 'ant-design-vue/es/config-provider'
// import type {
//   FilterDropdownProps,
//   FilterValue,
//   SorterResult,
// } from 'ant-design-vue/es/table/interface'
// import type {
//   DataIndex,
//   ExpandedRowRender,
// } from 'ant-design-vue/es/vc-table/interface'
// import type { CSSProperties, ComputedRef, Ref, VNode } from 'vue'

import type {
  DataObject,
  DeepMaybeRefOrGetter,
  // ExtractMaybeRef,
  // MaybeRef,
  NamePath,
  ValueType,
} from '../common'
import type {
  ActionGroupOption,
  ActionOption,
  CustomActions,
  InternalProButtonGroupOptions,
} from '../ProButton'
import type {
  buildDictionary,
  DictionaryCollection,
  DictionaryColumn,
} from '../ProDictionary'
import type {
  BuildFormBinding,
  BuildFormOptionResult,
  ProFormScope,
} from '../ProForm'
import type { MaybeRefOrGetter } from '@vueuse/core'
import type { TableProps } from 'ant-design-vue'
import type { ColumnType } from 'ant-design-vue/es/table'
import type {
  ExpandedRowRender,
  RenderExpandIconProps,
} from 'ant-design-vue/es/vc-table/interface'
import type { ComputedRef, Ref, VNodeChild } from 'vue'

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
  page: { pageSize: number; pageNum: number } | undefined
  params?: Params
}

// /**
//  * headerCell 插槽参数
//  */
// export type HeaderCellSlotParams<T> = { column: ColumnType<T>; title: string }

// /**
//  * bodyCell 插槽参数
//  */
// export type BodyCellSlotParams<T> = {
//   text: any
//   index: number
//   column: ColumnType<T>
//   record: T
//   editable: boolean
// }

// /**
//  * ProTable 组件实例方法
//  */
// export type ProTableInstance<T> = ProTableScope<T>

/**
 * Pro Table 列配置
 */
export interface ProTableColumnProps<
  Data = any,
  Dictionary = any,
  Collection = any
> extends DictionaryColumn<Dictionary, Collection> {
  // /**
  //  * 分组列配置
  //  */
  // children?: ProTableColumnProps<T> | ProTableColumnProps<T>[]

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
   * 自定义渲染表头
   */
  renderHeader?(): VNodeChild

  /**
   * 自定义渲染单元格
   */
  renderCell?(): VNodeChild

  /**
   * 自定义渲染筛选菜单
   */
  renderFilterDropdown?(): VNodeChild

  /**
   * 自定义渲染筛选图标
   */
  renderFilterIcon?(): VNodeChild

  // /**
  //  * 编辑配置
  //  */
  // editable?: ProTableColumnEditable<T>
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

// /**
//  * 操作列配置
//  */
// export type ProTableActionColumnProps<T> = Omit<
//   ProTableColumnProps<T>,
//   'type' | 'dict' | 'editable'
// > & {
//   /**
//    * 操作按钮组
//    */
//   actions?: ActionsList<ProTableActions<T>>
// }

// export type ProTableActions<T> = Record<string, ProTableActionProps<T>>

// /**
//  * 操作列按钮配置
//  */
// export interface ProTableActionProps<T>
//   extends Omit<ActionOption, 'props' | 'confirmProps'> {
//   /**
//    * 按钮 props
//    */
//   props?: Omit<ButtonProps, 'onClick'> & {
//     onClick?: (e: MouseEvent, ctx: BodyCellSlotParams<T>) => void
//   }

//   /**
//    * 确认弹窗 props
//    */
//   confirmProps?: ProTableActionConfirmProps<T> | ProTableActionModalProps<T>
// }

// /**
//  * Popconfirm props，onConfirm 事件多了一个参数：行数据
//  */
// export type ProTableActionConfirmProps<T> = Omit<
//   PopconfirmProps,
//   'onConfirm'
// > & {
//   onConfirm?(e: MouseEvent, ctx: BodyCellSlotParams<T>): void
// }

// /**
//  * MessageBox props，callback 多了一个参数：行数据
//  */
// export type ProTableActionModalProps<T> = Omit<ModalProps, 'onOk'> & {
//   onOk?(ctx: BodyCellSlotParams<T>): void
// }

// export type ProTableColumnEditable<T> =
//   | false
//   | ((ctx: BodyCellSlotParams<T>) => boolean)

// /**
//  * 列插槽
//  */
// export type ProTableColumnSlots<T> = {
//   headerCell?(ctx: HeaderCellSlotParams<T>): JSXElement
//   bodyCell?(ctx: BodyCellSlotParams<T>): JSXElement
// }

// /**
//  * @internal
//  */
// export interface InternalProTableColumnProps<T> {
//   show: boolean
//   name: DataIndex | undefined
//   type: ValueType | any
//   dict?: ReturnType<typeof useDictionary>
//   renderCell?: boolean
//   editable?: ProTableColumnEditable<T>
//   columnProps: ColumnType<T>
//   columnSlots?: ProTableColumnSlots<T> | undefined
// }

// /**
//  * buildTable 返回值
//  */
// export type BuildProTableResult<T extends object> = {
//   proTableRef: Ref<ProTableInstance<T> | null>
//   proTableBinding: BuildProTableBinding<T>
// }

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

  // /**
  //  * 初始页数
  //  *
  //  * @default 1
  //  */
  // initialPageNumber?: number

  /**
   * Table 插槽
   */
  // tableSlots?: TableSlots<Data>

  /**
   * TODO: 列配置
   */
  columns?: MaybeRefOrGetter<ProTableColumnProps<Data, any, Collection>[]>

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
   */
  search?:
    | MaybeRefOrGetter<
        false | BuildFormOptionResult<SearchForm, SearchFormSubmit, Collection>
      >
    | ((
        scope: ProFormScope<SearchForm>
      ) => BuildFormOptionResult<SearchForm, SearchFormSubmit, Collection>)

  /**
   * 编辑配置
   */
  // editable?: ProTableEditable<T>

  /**
   * 是否自动填充父元素
   */
  // autoFill?: boolean

  // /**
  //  * 提交编辑行内容
  //  */
  // submitEditable?: (
  //   values: T,
  //   ctx: BodyCellSlotParams<T>
  // ) => Promise<boolean> | boolean

  // /**
  //  * table 尺寸发生改变
  //  */
  // onSizeChange?: (size: SizeType) => void

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
  renderEmptyText?(): VNodeChild

  /**
   * 渲染总结栏
   */
  renderSummary?(): VNodeChild

  /**
   * 渲染表格标题
   */
  renderTitle?(currentPageData: Data[]): VNodeChild

  /**
   * 渲染表格尾部
   */
  renderFooter?(currentPageData: Data[]): VNodeChild

  /**
   * 渲染展开图标
   */
  renderExpandIcon?(props: RenderExpandIconProps<Data>): VNodeChild

  /**
   * 渲染展开列表头
   */
  renderExpandColumnTitle?(): VNodeChild

  /**
   * 渲染展开行
   */
  renderExpandedRow?(props: Parameters<ExpandedRowRender<Data>>[0]): VNodeChild
}

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
export interface ProTableScope {
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
  FormData extends DataObject = DataObject
> {
  tableProps: ComputedRef<TableProps<Data>> | undefined
  proFormBinding: false | BuildFormBinding<FormData>
  toolbar: Ref<InternalProButtonGroupOptions>
}

/**
 * @internal
 */
export interface InternalProTableColumnProps<Data = any> {
  /**
   * 是否显示
   */
  show: boolean

  /**
   * 类型
   */
  type?: ValueType

  /**
   * 列 Props
   */
  columnProps?: ColumnType<Data>

  /**
   * 字典配置
   */
  dictionary?: ReturnType<typeof buildDictionary>
}
