// import type {
//   ColumnDictionaryOptions,
//   DictionaryCollectionOptions,
//   MaybeRef,
//   ValueType,
// } from '../common'
// import type { ActionOption, ActionsList, ActionsOption } from '../ProButton'
// import type {
//   BuildFormBinding,
//   BuildFormOptionResult,
//   ProFormColumnOptions,
//   ProFormInstance,
//   ProFormScope,
// } from '../ProForm'
// import type { BuildSearchBinding, ProSearchScope } from '../ProSearch'
// import type {
//   BodyCellSlotParams,
//   BuildProTableBinding,
//   BuildProTableOptionResult,
//   FetchTableDataResult,
//   FetchTableListQuery,
//   ProTableActionColumnProps,
//   ProTableActionProps,
//   ProTableColumnProps,
//   ProTableScope,
//   ProTableToolbarOption,
//   ToolbarOption,
// } from '../ProTable'
// import type { SuccessToastOptions } from '../Toast'
// import type { ModalProps } from 'ant-design-vue'
// import type { ComputedRef, Ref } from 'vue'

import type { DataObject } from '../common'
import type { BuildModalFormOptionReturn, ModalFormScope } from '../ModalForm'
import type { ActionGroupOption, ActionOption } from '../ProButton'
import type { ProFormColumnOptions, ProFormScope } from '../ProForm'
import type {
  BuildProTableOptionResult,
  FetchTableListRequest,
  ProTableColumnProps,
  ProTableScope,
  RenderBodyCellTextParams,
} from '../ProTable'
import type { ToastOptions } from '../Toast'
import type { MaybeRefOrGetter } from 'vue'

// /**
//  * ProCrud props
//  *
//  * @param T 表格数据
//  * @param S 分页接口实际返回数据
//  * @param F 查询表单数据
//  * @param R 查询表单传递数据
//  */
// export type ProCrudProps<
//   T extends object,
//   S extends object,
//   A extends object,
//   E extends object
// > = BuildCrudBinding<T, S, A, E>

// /**
//  * 分页请求入参转换函数参数
//  */
// export interface TransformQueryParams<S extends object, P extends object> {
//   /**
//    * 分页信息，排序信息
//    */
//   query: FetchTableListQuery<any, P>

//   /**
//    * 表单值
//    */
//   form: S
// }

// /**
//  * 分页请求出参转换函数参数
//  */
// export interface TransformResponseParams<S1 extends object, R extends object> {
//   query: S1
//   response: R
// }

/**
 * ProCrud 作用域
 */
export interface ProCrudScope<
  Data extends DataObject = DataObject
  // T extends object,
  // S extends object,
  // A extends object,
  // E extends object
> {
  search: ProFormScope<Partial<Data>>
  table: ProTableScope<Data>
  modal: ProCrudModalScope<Data>
  // addForm: CrudFormScope<A>
  // editForm: CrudFormScope<E>
  // viewForm: CrudFormScope<T>
}

/**
 * Pro Crud Modal 作用域
 */
export type ProCrudModalScope<Data extends DataObject = DataObject> = Omit<
  ModalFormScope<Partial<Data>>,
  'showModal'
> & {
  showEditModal(record: Data): void
  showAddModal(record: Data): void
  showViewModal(record: Data): void
}

// /**
//  * ProCrud 表单作用域，包含打开、关闭弹窗方法
//  */
// export interface CrudFormScope<T extends object> extends ProFormScope<T> {
//   showDialog(values?: any): void
//   hideDialog(): void
//   clear(values?: any): void
// }

// /**
//  * buildCrud 返回值
//  */
// export interface BuildCrudReturn<
//   T extends object,
//   S extends object,
//   A extends object,
//   E extends object
// > {
//   proCrudRef: Ref<ProCrudInstance | null>
//   proCrudBinding: BuildCrudBinding<T, S, A, E>
// }

// /**
//  * buildCrud 返回需要绑定的 props
//  */
// export interface BuildCrudBinding<
//   T extends object,
//   S extends object,
//   A extends object,
//   E extends object
// > {
//   /**
//    * 是否显示搜索栏
//    */
//   searchShow: ComputedRef<boolean>

//   /**
//    * 搜索配置
//    */
//   searchBinding: BuildSearchBinding<S>

//   /**
//    * 是否显示 table
//    */
//   tableShow: ComputedRef<boolean>

//   /**
//    * table 配置
//    */
//   tableBinding: BuildProTableBinding<T>

//   /**
//    * 弹窗类型
//    */
//   modalType: Ref<ModalType | undefined>

//   /**
//    * 是否显示表单弹窗
//    */
//   modalShow?: ComputedRef<boolean>

//   /**
//    * 弹窗配置
//    */
//   modalProps: ComputedRef<CrudDialogOption | undefined>

//   /**
//    * 弹窗表单配置
//    */
//   modalFormProps: ComputedRef<
//     BuildFormBinding<A> | BuildFormBinding<E> | BuildFormBinding<T> | undefined
//   >

//   /**
//    * 删除成功提示
//    */
//   deleteToast?: SuccessToastOptions

//   /**
//    * 新增成功提示
//    */
//   addToast?: SuccessToastOptions

//   /**
//    * 编辑成功提示
//    */
//   editToast?: SuccessToastOptions
// }

// /**
//  * buildCrud option 类型
//  */
// export type BuildCrudOption<
//   C,
//   T extends object,
//   R extends object,
//   S extends object,
//   S1 extends object,
//   A extends object,
//   E extends object
// > = (
//   scope: ProCrudScope<T, S, A, E>,
//   ctx: C | undefined
// ) => BuildCrudOptionReturn<T, R, S, S1, A, E>

// /**
//  * buildCrud option 返回值
//  */
export interface BuildCrudOptionReturn<
  Data extends DataObject = DataObject,
  Params = any,
  Collection = any,
  SearchForm extends DataObject = DataObject,
  SearchFormSubmit = SearchForm
> extends Omit<
      BuildProTableOptionResult<
        Data,
        Params,
        Collection,
        SearchForm,
        SearchFormSubmit
      >,
      'columns' | 'fetchTableData' | 'actionColumn'
    >,
    Omit<BuildModalFormOptionReturn, 'renderTrigger'> {
  /**
   * 列配置
   */
  columns?: ProCrudColumnOption<Data, any, Collection>[]

  /**
   * 列按钮组
   */
  actionColumn?: MaybeRefOrGetter<ProCrudActionColumnOptions>

  /**
   * 点击重置后是否自动调用查询接口
   *
   * @default true
   */
  autoReload?: boolean

  /**
   * 删除成功提示
   *
   * @default '删除成功'
   */
  deleteToast?: ToastOptions

  /**
   * 新增成功提示
   *
   * @default '新增成功'
   */
  addToast?: ToastOptions

  /**
   * 编辑成功提示
   *
   * @default '编辑成功'
   */
  editToast?: ToastOptions

  /**
   * 获取数据请求
   */
  fetchTableData?: FetchTableListRequest<Data, Params>

  /**
   * 删除接口
   *
   * @param row 行数据
   * @returns {boolean} 删除是否成功，返回 true 会有提示信息
   */
  deleteRequest?: (
    options: RenderBodyCellTextParams<Data>
  ) => Promise<boolean> | boolean

  /**
   * 添加接口
   *
   * @param form 编辑表单数据
   * @returns {boolean} 添加是否成功，返回 true 会有提示信息
   */
  addRequest?: (form: Partial<Data>) => Promise<boolean> | boolean

  /**
   * 编辑接口
   *
   * @param form 编辑表单数据 + 行数据
   * @returns {boolean} 编辑是否成功，返回 true 会有提示信息
   */
  editRequest?: (form: Partial<Data>) => Promise<boolean> | boolean
}

/**
 * Pro Crud 操作列
 */
export type ProCrudActionColumnOptions<Data extends DataObject = DataObject> =
  ProTableColumnProps<Data> & {
    action?: ProCrudActionColumnGroup<Data>
  }

/**
 * Pro Crud 操作列按钮组
 */
export type ProCrudActionColumnGroup<Data extends DataObject = DataObject> =
  ActionGroupOption<
    ProCrudActionColumnActions<RenderBodyCellTextParams<Data>>,
    {}
  >

/**
 * Pro Crud 列按钮
 */
export type ProCrudActionColumnActions<C = any> = {
  /**
   * 查看
   */
  view?: MaybeRefOrGetter<ActionOption<C>>

  /**
   * 编辑
   */
  edit?: MaybeRefOrGetter<ActionOption<C>>

  /**
   * 删除
   */
  delete?: MaybeRefOrGetter<ActionOption<C>>

  /**
   * 自定义按钮
   */
  [name: string]: MaybeRefOrGetter<ActionOption<C>> | undefined
}

/**
 * 弹窗类型
 */
export const enum ModalType {
  /**
   * 新增
   */
  Add,

  /**
   * 编辑
   */
  Edit,

  /**
   * 查看
   */
  View,
}

export interface BuildCrudContext<
  Data extends DataObject = DataObject,
  Collection = any
> {
  options(scope: ProCrudScope<Data>): BuildCrudOptionReturn<Data, Collection>
  optionResult: BuildCrudOptionReturn<Data, Collection>
  scope: ProCrudScope<Data>
}

// /**
//  * ProCrud Table Toolbar Actions
//  */
// export type ProCrudTableToolbarActions = {
//   /**
//    * 添加操作
//    */
//   add?: ToolbarOption
// }

// export type CrudActionOption<T extends object> = Omit<
//   ProTableActionColumnProps<T>,
//   'actions'
// > & {
//   actions?: ActionsList<CrudTableActions<T>>
// }

// /**
//  * ProCrud 添加、编辑、查看表单配置
//  */
// export type CrudFormOption = Omit<BuildFormOptionResult<any>, 'columns'> & {
//   show?: MaybeRef<boolean>
// }

// /**
//  * 确定按钮
//  */
// export interface ConfirmAction {
//   confirm?: ActionOption
// }

// /**
//  * 取消按钮
//  */
// export interface CancelAction {
//   cancel?: ActionOption
// }

// /**
//  * 搜索按钮
//  */
// export interface SearchAction {
//   confirm?: ActionOption
//   reset?: ActionOption
// }

// /**
//  * ProCrud AddForm、EditForm 配置
//  */
// export type CrudFormOptionResult = Omit<CrudFormOption, 'actions'> & {
//   actions?: ActionsOption<ConfirmAction & CancelAction>
// }

// /**
//  * ProCrud Search
//  */
// export type CrudSearchOptionResult = Omit<CrudFormOption, 'actions'> & {
//   actions?: ActionsOption<SearchAction>
// }

// /**
//  * ProCrud ViewForm 配置
//  */
// export type CrudViewFormOptionResult = Omit<CrudFormOption, 'actions'> & {
//   actions?: ActionsOption<CancelAction>
// }

// /**
//  * ProCrud 弹窗配置
//  */
// export interface CrudDialogOption {
//   props?: ModalProps

//   /**
//    * @default 'a-modal'
//    */
//   is?: any
// }

// /**
//  * Crud 操作列配置
//  */
// export interface CrudTableActions<T extends object> {
//   /**
//    * 编辑按钮
//    */
//   edit?: ProTableActionProps<T>

//   /**
//    * 删除按钮
//    */
//   delete?: ProTableActionProps<T>

//   /**
//    * 查看按钮
//    */
//   view?: ProTableActionProps<T>
// }

// /**
//  * ProCrud 实例
//  */
// export interface ProCrudInstance {
//   proSearchRef: Ref<ProFormInstance<any> | null>
//   // proTableRef: Ref<ProTableInstance<any> | null>
// }

/**
 * ProdCrud Column 配置
 */
export interface ProCrudColumnOption<
  Data extends DataObject = any,
  Dictionary = any,
  Collection = any
> extends ProTableColumnProps<Data, Dictionary, Collection> {
  /**
   * 添加表单配置
   */
  addForm?: MaybeRefOrGetter<
    Omit<ProFormColumnOptions<Data, Dictionary, Collection>, 'dict' | 'type'>
  >

  /**
   * 编辑表单配置
   */
  editForm?: MaybeRefOrGetter<
    Omit<ProFormColumnOptions<Data, Dictionary, Collection>, 'dict' | 'type'>
  >

  /**
   * 详情表单配置
   */
  viewForm?: MaybeRefOrGetter<
    Omit<ProFormColumnOptions<Data, Dictionary, Collection>, 'dict' | 'type'>
  >
}

// export type ProCrudFormOptions<T extends object> = Omit<
//   ProFormColumnOptions<T>,
//   'label' | 'name' | 'type' | 'dict'
// >

// export type BuildCrudContext<
//   T extends object,
//   R extends object,
//   S extends object,
//   S1 extends object,
//   A extends object,
//   E extends object
// > = {
//   originCtx: any
//   optionResult: BuildCrudOptionReturn<T, R, S, S1, A, E>
//   scope: ProCrudScope<T, S, A, E>
//   columns: {
//     search: ProCrudColumnOption<T, S, A, E>[]
//     table: ProCrudColumnOption<T, S, A, E>[]
//     addForm: ProCrudColumnOption<T, S, A, E>[]
//     editForm: ProCrudColumnOption<T, S, A, E>[]
//     viewForm: ProCrudColumnOption<T, S, A, E>[]
//   }
//   show: {
//     search: ComputedRef<boolean>
//     table: ComputedRef<boolean>
//     addForm: ComputedRef<boolean>
//     editForm: ComputedRef<boolean>
//     viewForm: ComputedRef<boolean>
//   }
//   binding: {
//     search: BuildSearchBinding<S>
//     table: BuildProTableBinding<T>
//     addForm: BuildFormBinding<A>
//     editForm: BuildFormBinding<E>
//     viewForm: BuildFormBinding<T>
//   }
//   dialog: {
//     addForm: ComputedRef<CrudDialogOption>
//     editForm: ComputedRef<CrudDialogOption>
//     viewForm: ComputedRef<CrudDialogOption>
//   }
//   options: BuildCrudOption<any, T, R, S, S1, A, E>
//   modalType: Ref<ModalType | undefined>
// }

// export type ModalType = 'view' | 'edit' | 'add'
