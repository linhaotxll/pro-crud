import type { DictionaryOption, MaybeRef, ValueType } from '../common'
import type { ActionOption, ActionsOption } from '../ProButton'
import type {
  BuildFormBinding,
  BuildFormOptionResult,
  ProFormColumnOptions,
  ProFormInstance,
  ProFormScope,
} from '../ProForm'
import type { BuildSearchBinding, ProSearchScope } from '../ProSearch'
import type {
  BodyCellSlotParams,
  BuildProTableBinding,
  BuildProTableOptionResult,
  FetchTableDataResult,
  FetchTableListQuery,
  ProTableActionColumnProps,
  ProTableActionProps,
  ProTableActions,
  ProTableColumnProps,
  ProTableScope,
} from '../ProTable'
import type { ModalProps } from 'ant-design-vue'
import type { ComputedRef, Ref } from 'vue'

/**
 * ProCrud props
 *
 * @param T 表格数据
 * @param S 分页接口实际返回数据
 * @param F 查询表单数据
 * @param R 查询表单传递数据
 */
export type ProCrudProps<
  T extends object,
  S extends object,
  A extends object,
  E extends object
> = BuildCrudBinding<T, S, A, E>

/**
 * ProCrud 请求配置
 */
export interface ProCrudRequest<
  T extends object,
  R extends object,
  S extends object,
  S1 extends object,
  A extends object,
  E extends object
> {
  /**
   * 转换请求前的参数
   *
   * @param {TransformQueryParams} ctx 查询参数，包含分页，搜索条件
   * @returns 转换后的参数，直接传递给 fetchPaginationData 请求
   */
  transformQuery?(ctx: TransformQueryParams<S, any>): S1

  /**
   * 转换请求后的响应数据
   *
   * @param {TransformResponseParams} ctx 响应参数，包含响应数据、查询数据
   */
  transformResponse?(
    ctx: TransformResponseParams<S1, R>
  ): FetchTableDataResult<T>

  /**
   * 获取分页接口
   *
   * @param params 若有 transformQuery 则是其结果，没有则是 TransformQueryParams<F>
   * @returns 返回结果，若有 transformResponse 则是其转换结果，没有则必须是 FetchTableDataResult
   */
  fetchPaginationData?(params: S1): Promise<R>

  /**
   * 删除接口
   *
   * @param row 行数据
   * @returns {boolean} 删除是否成功，返回 true 会有提示信息
   */
  deleteRequest?: (options: BodyCellSlotParams<T>) => Promise<boolean>

  /**
   * 添加接口
   *
   * @param form 编辑表单数据
   * @returns {boolean} 添加是否成功，返回 true 会有提示信息
   */
  addRequest?: (form: A) => Promise<boolean>

  /**
   * 编辑接口
   *
   * @param form 编辑表单数据 + 行数据
   * @returns {boolean} 编辑是否成功，返回 true 会有提示信息
   */
  editRequest?: (form: E) => Promise<boolean>
}

/**
 * 分页请求入参转换函数参数
 */
export interface TransformQueryParams<S extends object, P extends object> {
  /**
   * 分页信息，排序信息
   */
  query: FetchTableListQuery<any, P>

  /**
   * 表单值
   */
  form: S
}

/**
 * 分页请求出参转换函数参数
 */
export interface TransformResponseParams<S1 extends object, R extends object> {
  query: S1
  response: R
}

/**
 * ProCrud 作用域
 */
export interface ProCrudScope<
  T extends object,
  S extends object,
  A extends object,
  E extends object
> {
  search: ProSearchScope<S>
  table: ProTableScope
  addForm: CrudFormScope<A>
  editForm: CrudFormScope<E>
  viewForm: CrudFormScope<T>
}

/**
 * ProCrud 表单作用域，包含打开、关闭弹窗方法
 */
export interface CrudFormScope<T extends object> extends ProFormScope<T> {
  showDialog(values?: any): void
  hideDialog(): void
}

/**
 * buildCrud 返回值
 */
export interface BuildCrudReturn<
  T extends object,
  S extends object,
  A extends object,
  E extends object
> {
  proCrudRef: Ref<ProCrudInstance | null>
  proCrudBinding: BuildCrudBinding<T, S, A, E>
}

/**
 * buildCrud 返回需要绑定的 props
 */
export interface BuildCrudBinding<
  T extends object,
  S extends object,
  A extends object,
  E extends object
> {
  /**
   * 是否显示搜索栏
   */
  searchShow: ComputedRef<boolean>

  /**
   * 搜索配置
   */
  searchBinding: BuildSearchBinding<S>

  /**
   * 是否显示 table
   */
  tableShow: ComputedRef<boolean>

  /**
   * table 配置
   */
  tableBinding: BuildProTableBinding<T>

  /**
   * 弹窗类型
   */
  modalType: Ref<ModalType | undefined>

  /**
   * 是否显示表单弹窗
   */
  modalShow?: ComputedRef<boolean>

  /**
   * 弹窗配置
   */
  modalProps: ComputedRef<CrudDialogOption | undefined>

  /**
   * 弹窗表单配置
   */
  modalFormProps: ComputedRef<
    BuildFormBinding<A> | BuildFormBinding<E> | BuildFormBinding<T> | undefined
  >
}

/**
 * buildCrud option 类型
 */
export type BuildCrudOption<
  C,
  T extends object,
  R extends object,
  S extends object,
  S1 extends object,
  A extends object,
  E extends object
> = (
  scope: ProCrudScope<T, S, A, E>,
  ctx: C | undefined
) => BuildCrudOptionReturn<T, R, S, S1, A, E>

/**
 * buildCrud option 返回值
 */
export interface BuildCrudOptionReturn<
  T extends object,
  R extends object,
  S extends object,
  S1 extends object,
  A extends object,
  E extends object
> {
  /**
   * 所有列配置
   */
  columns?: ProCrudColumnOption<T, S, A, E>[]

  /**
   * 搜索栏配置
   */
  search?: CrudSearchOptionResult

  /**
   * 添加、编辑、查看表单公共配置
   */
  form?: CrudFormOption

  /**
   * 添加、编辑、查看弹窗公共配置
   */
  dialog?: CrudDialogOption

  /**
   * 添加表单配置
   */
  addForm?: CrudFormOptionResult

  /**
   * 添加表单弹窗配置
   */
  addFormDialog?: CrudDialogOption

  /**
   * 编辑表单配置
   */
  editForm?: CrudFormOptionResult

  /**
   * 编辑表单弹窗配置
   */
  editFormDialog?: CrudDialogOption

  /**
   * 查看表单配置
   */
  viewForm?: CrudViewFormOptionResult

  /**
   * 查看表单弹窗配置
   */
  viewFormDialog?: CrudDialogOption

  /**
   * 表格配置
   */
  table?: Omit<
    BuildProTableOptionResult<T, any>,
    'data' | 'columns' | 'request' | 'action'
  > & {
    show?: MaybeRef<boolean>
  }

  /**
   * 请求配置
   */
  request?: ProCrudRequest<T, R, S, S1, A, E>

  /**
   * 点击重置后是否自动调用查询接口
   *
   * @default true
   */
  autoReload?: boolean

  /**
   * 操作列配置
   */
  action?: CrudTableOperateProps<T>
}

/**
 * ProCrud 添加、编辑、查看表单配置
 */
export type CrudFormOption = Omit<
  BuildFormOptionResult<any>,
  'columns' | 'request'
> & {
  show?: MaybeRef<boolean>
}

/**
 * 确定按钮
 */
export interface ConfirmAction {
  confirm?: ActionOption
}

/**
 * 取消按钮
 */
export interface CancelAction {
  cancel?: ActionOption
}

/**
 * 搜索按钮
 */
export interface SearchAction {
  confirm?: ActionOption
  reset?: ActionOption
}

/**
 * ProCrud AddForm、EditForm 配置
 */
export type CrudFormOptionResult = Omit<CrudFormOption, 'actions'> & {
  actions?: ActionsOption<ConfirmAction & CancelAction>
}

/**
 * ProCrud Search
 */
export type CrudSearchOptionResult = Omit<CrudFormOption, 'actions'> & {
  actions?: ActionsOption<SearchAction>
}

/**
 * ProCrud ViewForm 配置
 */
export type CrudViewFormOptionResult = Omit<CrudFormOption, 'actions'> & {
  actions?: ActionsOption<CancelAction>
}

/**
 * ProCrud 弹窗配置
 */
export interface CrudDialogOption {
  props?: ModalProps

  /**
   * @default 'a-modal'
   */
  is?: any
}

/**
 * 操作列配置
 */
export interface CrudTableOperateProps<T extends object>
  extends Omit<ProTableActionColumnProps<T>, 'actions'> {
  // 按钮组配置
  actions: {
    /**
     * 编辑按钮
     */
    edit?: ProTableActionProps<T>

    /**
     * 删除按钮
     */
    delete?: ProTableActionProps<T>

    /**
     * 查看按钮
     */
    view?: ProTableActionProps<T>
  } & ProTableActions<T>
}

/**
 * ProCrud 实例
 */
export interface ProCrudInstance {
  proSearchRef: Ref<ProFormInstance<any> | null>
  // proTableRef: Ref<ProTableInstance<any> | null>
}

/**
 * ProdCrud Column 配置
 *
 * @param T 整个表单值
 */
export interface ProCrudColumnOption<
  T extends object,
  S extends object,
  A extends object,
  E extends object
> {
  /**
   * 名称
   */
  label?: MaybeRef<string>

  /**
   * 字段值
   */
  name: MaybeRef<string>

  /**
   * 类型
   */
  type?: MaybeRef<ValueType>

  /**
   * 字典
   */
  dict?: DictionaryOption

  /**
   * 查询表单列配置
   */
  search?: ProCrudFormOptions<S>

  /**
   * 表格列配˙
   */
  table?: Omit<ProTableColumnProps<T>, 'label' | 'prop' | 'dict'>

  /**
   * 编辑表单列配置
   */
  editForm?: ProCrudFormOptions<E>

  /**
   * 新增表单列配置
   */
  addForm?: ProCrudFormOptions<A>

  /**
   * 详情表单列配置
   */
  viewForm?: ProCrudFormOptions<T>

  /**
   * 表格列配置
   */
  column?: Omit<ProTableColumnProps<T>, 'label' | 'prop'>
}

export type ProCrudFormOptions<T extends object> = Omit<
  ProFormColumnOptions<T>,
  'label' | 'name' | 'type' | 'dict'
>

export type BuildCrudContext<
  T extends object,
  R extends object,
  S extends object,
  S1 extends object,
  A extends object,
  E extends object
> = {
  originCtx: any
  optionResult: BuildCrudOptionReturn<T, R, S, S1, A, E>
  scope: ProCrudScope<T, S, A, E>
  columns: {
    search: ProCrudColumnOption<T, S, A, E>[]
    table: ProCrudColumnOption<T, S, A, E>[]
    addForm: ProCrudColumnOption<T, S, A, E>[]
    editForm: ProCrudColumnOption<T, S, A, E>[]
    viewForm: ProCrudColumnOption<T, S, A, E>[]
  }
  show: {
    search: ComputedRef<boolean>
    table: ComputedRef<boolean>
    addForm: ComputedRef<boolean>
    editForm: ComputedRef<boolean>
    viewForm: ComputedRef<boolean>
  }
  binding: {
    search: BuildSearchBinding<S>
    table: BuildProTableBinding<T>
    addForm: BuildFormBinding<A>
    editForm: BuildFormBinding<E>
    viewForm: BuildFormBinding<T>
  }
  dialog: {
    addForm: ComputedRef<CrudDialogOption>
    editForm: ComputedRef<CrudDialogOption>
    viewForm: ComputedRef<CrudDialogOption>
  }
  options: BuildCrudOption<any, T, R, S, S1, A, E>
  modalType: Ref<ModalType | undefined>
}

export type ModalType = 'view' | 'edit' | 'add'
