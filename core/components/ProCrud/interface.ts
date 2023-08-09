import type {
  ElButtonProps,
  ElDialogProps,
  ElPopconfirmProps,
  MaybeRef,
} from '../common'
import type {
  BuildFormBinding,
  BuildFormOptionResult,
  ButtonOption,
  ButtonsOption,
  ProFormButtons,
  ProFormColumnOptions,
  ProFormInstance,
  ProFormScope,
} from '../ProForm'
import type { BuildSearchBinding, ProSearchScope } from '../ProSearch'
import type {
  BuildProTableBinding,
  BuildProTableOptionResult,
  FetchTableDataResult,
  FetchTableListQuery,
  ProTableColumnProps,
  ProTableInstance,
  ProTableScope,
  TableDefaultSlotParams,
} from '../ProTable'
import type { Action, ElMessageBoxOptions } from 'element-plus'
import type { ComputedRef, Ref } from 'vue'

/**
 * ProCrud props
 *
 * @param T 表格数据
 * @param S 分页接口实际返回数据
 * @param F 查询表单数据
 * @param R 查询表单传递数据
 */
export type ProCrudProps<T extends object> = BuildCrudBinding<T>

/**
 * ProCrud 请求配置
 */
export interface ProCrudRequest<T extends object> {
  /**
   * 转换请求前的参数
   *
   * @param {TransformQueryParams} ctx 查询参数，包含分页，搜索条件
   * @returns 转换后的参数，直接传递给 fetchPaginationData 请求
   */
  transformQuery?(ctx: TransformQueryParams<any>): any

  /**
   * 转换请求后的响应数据
   *
   * @param {TransformResponseParams} ctx 响应参数，包含响应数据、查询数据
   */
  transformResponse?(
    ctx: TransformResponseParams<any, any>
  ): FetchTableDataResult<T>

  /**
   * 获取分页接口
   *
   * @param {any} params 若有 transformQuery 则是其结果，没有则是 TransformQueryParams<F>
   * @returns 返回结果，若有 transformResponse 则是其转换结果，没有则必须是 FetchTableDataResult
   */
  fetchPaginationData?(params: any): Promise<any>

  /**
   * 删除接口
   *
   * @param row 行数据
   * @returns {boolean} 删除是否成功，返回 true 会有提示信息
   */
  deleteRequest?: (row: T, index: number) => Promise<boolean>

  /**
   * 添加接口
   *
   * @param form 编辑表单数据
   * @returns {boolean} 添加是否成功，返回 true 会有提示信息
   */
  addRequest?: (form: any) => Promise<boolean>

  /**
   * 编辑接口
   *
   * @param form 编辑表单数据 + 行数据
   * @returns {boolean} 编辑是否成功，返回 true 会有提示信息
   */
  editRequest?: (form: any) => Promise<boolean>
}

/**
 * 分页请求入参转换函数参数
 */
export interface TransformQueryParams<F extends object> {
  /**
   * 分页信息，排序信息
   */
  query: FetchTableListQuery

  /**
   * 表单值
   */
  form: F
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
export interface ProCrudScope {
  search: ProSearchScope<any>
  table: ProTableScope<any>
  addForm: CrudFormScope
  editForm: CrudFormScope
  viewForm: CrudFormScope
}

/**
 * ProCrud 表单作用域，包含打开、关闭弹窗方法
 */
export interface CrudFormScope extends ProFormScope<any> {
  showDialog(values?: any): void
  hideDialog(): void
}

/**
 * buildCrud 返回值
 */
export interface BuildCrudReturn<T extends object> {
  proCrudRef: Ref<ProCrudInstance | null>
  proCrudBinding: BuildCrudBinding<T>
}

/**
 * buildCrud 返回需要绑定的 props
 */
export interface BuildCrudBinding<T extends object> {
  /**
   * 是否显示搜索栏
   */
  searchShow: ComputedRef<boolean>

  /**
   * 搜索配置
   */
  searchBinding: BuildSearchBinding<any>

  /**
   * 是否显示 table
   */
  tableShow: ComputedRef<boolean>

  /**
   * table 配置
   */
  tableBinding: BuildProTableBinding<T>

  /**
   * 是否显示添加表单
   */
  addFormShow: ComputedRef<boolean>

  /**
   * 添加表单配置
   */
  addFormBinding: BuildSearchBinding<any>

  /**
   * 添加表单弹窗配置
   */
  addFormDialog: ComputedRef<CrudDialogOption>

  /**
   * 是否显示编辑表单
   */
  editFormShow: ComputedRef<boolean>

  /**
   * 编辑表单配置
   */
  editFormBinding: BuildSearchBinding<any>

  /**
   * 编辑表单弹窗配置
   */
  editFormDialog: ComputedRef<CrudDialogOption>

  /**
   * 是否显示查看表单
   */
  viewFormShow: ComputedRef<boolean>

  /**
   * 查看表单配置
   */
  viewFormBinding: BuildSearchBinding<any>

  /**
   * 查看表单弹窗配置
   */
  viewFormDialog: ComputedRef<CrudDialogOption>
}

/**
 * buildCrud option 类型
 */
export type BuildCrudOption<C, T extends object> = (
  scope: ProCrudScope,
  ctx: C | undefined
) => BuildCrudOptionReturn<T>

/**
 * buildCrud option 返回值
 */
export interface BuildCrudOptionReturn<T extends object> {
  /**
   * 所有列配置
   */
  columns?: ProCrudColumnOption<any>[]

  /**
   * 搜索栏配置
   */
  search?: Omit<BuildFormOptionResult<any>, 'columns' | 'request'> & {
    show?: MaybeRef<boolean>
  }

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
    BuildProTableOptionResult<any>,
    'data' | 'columns' | 'request'
  > & {
    show?: MaybeRef<boolean>
  }

  /**
   * 请求配置
   */
  request?: ProCrudRequest<T>

  /**
   * 点击重置后是否自动调用查询接口
   *
   * @default true
   */
  autoReload?: boolean

  /**
   * 操作列配置
   */
  operates?: CrudTableOperateProps
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
 * ProCrud AddForm、EditForm 配置
 */
export type CrudFormOptionResult = Omit<CrudFormOption, 'buttons'> & {
  buttons?: Omit<ButtonsOption, 'list'> & {
    list?: ProFormButtons & { cancel?: ButtonOption }
  }
}

/**
 * ProCrud ViewForm 配置
 */
export type CrudViewFormOptionResult = Omit<CrudFormOption, 'buttons'> & {
  buttons?: Omit<ButtonsOption, 'list'> & {
    list?: { cancel?: ButtonOption; [name: string]: ButtonOption | undefined }
  }
}

/**
 * ProCrud 弹窗配置
 */
export interface CrudDialogOption {
  props?: ElDialogProps

  /**
   * @default 'el-dialog'
   */
  is?: any
}

/**
 * 操作列配置
 */
export interface CrudTableOperateProps extends ProTableColumnProps<object> {
  // 按钮组配置
  buttons?: {
    /**
     * 编辑按钮
     */
    edit?: CrudTableOperateButtonProps

    /**
     * 删除按钮
     */
    delete?: CrudTableOperateButtonProps

    /**
     * 查看按钮
     */
    view?: CrudTableOperateButtonProps

    /**
     * 其他按钮
     */
    [name: string]: CrudTableOperateButtonProps | undefined
  }
}

/**
 * 操作列按钮配置
 */
export interface CrudTableOperateButtonProps {
  /**
   * 是否展示
   */
  show?: MaybeRef<boolean>

  /**
   * 按钮文本
   */
  text?: MaybeRef<string>

  /**
   * 按钮顺序
   */
  order?: MaybeRef<number>

  /**
   * 按钮 props
   */
  props?: Omit<ElButtonProps, 'onClick'> & {
    onClick?: (e: MouseEvent, ctx: TableDefaultSlotParams<any>) => void
  }

  /**
   * 点击按钮确认弹窗类型，false 则不需要
   *
   * @default false
   */
  confirmType?: 'popconfirm' | 'messagebox' | false

  /**
   * 确认弹窗 props
   */
  confirmProps?: CrudTableOperateConfirmProps | CrudDeleteMessageBoxProps
}

/**
 * Popconfirm props，onConfirm 事件多了一个参数：行数据
 */
export type CrudTableOperateConfirmProps = Omit<
  ElPopconfirmProps,
  'onConfirm'
> & {
  onConfirm?(e: MouseEvent, ctx: TableDefaultSlotParams<any>): void
}

/**
 * MessageBox props，callback 多了一个参数：行数据
 */
export type CrudDeleteMessageBoxProps = Omit<
  ElMessageBoxOptions,
  'callback'
> & {
  callback?(action: Action, ctx: TableDefaultSlotParams<any>): void
}

/**
 * ProCrud 实例
 */
export interface ProCrudInstance {
  proSearchRef: Ref<ProFormInstance<any> | null>
  proTableRef: Ref<ProTableInstance<any> | null>
}

/**
 * ProdCrud Column 配置
 *
 * @param T 整个表单值
 */
export interface ProCrudColumnOption<T extends object> {
  /**
   * 名称
   */
  label?: MaybeRef<string>

  /**
   * 字段值
   */
  prop: MaybeRef<string>

  /**
   * 查询表单列配置
   */
  search?: Omit<ProFormColumnOptions<T>, 'label' | 'prop'>

  /**
   * 表格列配˙
   */
  table?: Omit<ProTableColumnProps<any>, 'label' | 'prop'>

  /**
   * 编辑表单列配置
   */
  editForm?: Omit<ProFormColumnOptions<T>, 'label' | 'prop'>

  /**
   * 新增表单列配置
   */
  addForm?: Omit<ProFormColumnOptions<T>, 'label' | 'prop'>

  /**
   * 详情表单列配置
   */
  viewForm?: Omit<ProFormColumnOptions<T>, 'label' | 'prop'>

  /**
   * 表格列配置
   */
  column?: Omit<ProTableColumnProps<any>, 'label' | 'prop'>
}

export type BuildCrudContext<T extends object> = {
  originCtx: any
  optionResult: BuildCrudOptionReturn<T>
  scope: ProCrudScope
  columns: {
    search: ProCrudColumnOption<any>[]
    table: ProCrudColumnOption<any>[]
    addForm: ProCrudColumnOption<any>[]
    editForm: ProCrudColumnOption<any>[]
    viewForm: ProCrudColumnOption<any>[]
  }
  show: {
    search: ComputedRef<boolean>
    table: ComputedRef<boolean>
    addForm: ComputedRef<boolean>
    editForm: ComputedRef<boolean>
    viewForm: ComputedRef<boolean>
  }
  binding: {
    search: BuildSearchBinding<any>
    table: BuildProTableBinding<any>
    addForm: BuildFormBinding<any>
    editForm: BuildFormBinding<any>
    viewForm: BuildFormBinding<any>
  }
  dialog: {
    addForm: ComputedRef<CrudDialogOption>
    editForm: ComputedRef<CrudDialogOption>
    viewForm: ComputedRef<CrudDialogOption>
  }
  options: BuildCrudOption<any, T>
}
