import type {
  ElButtonProps,
  ElDialogProps,
  ElPopconfirmProps,
  ElTooltipProps,
  ExtractMaybeRef,
  MaybeRef,
} from '../common'
import type {
  BuildFormBinding,
  BuildFormOptionResult,
  ProFormColumnOptions,
  ProFormInstance,
  ProFormScope,
} from '../ProForm'
import type {
  BuildSearchBinding,
  ProSearchProps,
  ProSearchScope,
} from '../ProSearch'
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
export type ProCrudProps<
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
> = BuildCrudBinding<T, S, F, R>

/**
 * ProCrud 请求配置
 */
export interface ProCrudRequest<
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
> {
  /**
   * 分页请求入参转换
   */
  transformQuery?(options: TransformQueryParams<F>): R | Promise<R>

  /**
   * 响应数据转换
   */
  transformRes?(
    options: TransformResponseParams<S, R>
  ): TransformResponseResult<T> | Promise<TransformResponseResult<T>>

  /**
   * 分页请求
   */
  fetchPageList(query: R): Promise<S>
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
export interface TransformResponseParams<S extends object, R extends object> {
  query: R
  response: S
}

/**
 * 分页请求出参转换函数返回值
 */
export interface TransformResponseResult<T extends object> {
  rows: T[]
  total: number
  pageSize: number
  pageNumber: number
}

/**
 * ProCrud 作用域
 */
export interface ProCrudScope {
  search: ProSearchScope<any>
  table: ProTableScope<any>
  addForm: ProFormScope<any> & {
    showDialog(values?: any): void
    hideDialog(): void
  }
  editForm: ProFormScope<any>
  viewForm: ProFormScope<any>
}

/**
 * buildCrud 返回值
 */
export interface BuildCrudReturn<
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
> {
  proCrudRef: Ref<ProCrudInstance | null>
  proCrudBinding: BuildCrudBinding<T, S, F, R>
}

export interface BuildCrudBinding<
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
> {
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
  tableBinding: BuildProTableBinding<any>

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
  addFormDialog: ComputedRef<ElDialogProps>

  /**
   * 是否显示编辑表单
   */
  editFormShow: ComputedRef<boolean>

  /**
   * 编辑表单配置
   */
  editFormBinding: BuildSearchBinding<any>

  /**
   * 是否显示查看表单
   */
  viewFormShow: ComputedRef<boolean>

  /**
   * 查看表单配置
   */
  viewFormBinding: BuildSearchBinding<any>
}

export type BuildCrudOption<
  C extends object,
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
> = (
  scope: ProCrudScope,
  ctx: C | undefined
) => BuildCrudOptionReturn<T, S, F, R>

/**
 * buildCrud option 返回值
 */
export interface BuildCrudOptionReturn<
  T extends object,
  S extends object = FetchTableDataResult<T>,
  F extends object = any,
  R extends object = any
> {
  // 所有列配置
  columns?: ProCrudColumnOption<any>[]

  // 搜索栏配置
  search?: Omit<BuildFormOptionResult<any>, 'columns' | 'request'> & {
    show?: MaybeRef<boolean>
  }

  // 添加表单配置
  addForm?: Omit<BuildFormOptionResult<any>, 'columns' | 'request'> & {
    show?: MaybeRef<boolean>
  }

  // 编辑表单配置
  editForm?: Omit<BuildFormOptionResult<any>, 'columns' | 'request'> & {
    show?: MaybeRef<boolean>
  }

  // 查看表单配置
  viewForm?: Omit<BuildFormOptionResult<any>, 'columns' | 'request'> & {
    show?: MaybeRef<boolean>
  }

  // 表格配置
  table?: Omit<
    BuildProTableOptionResult<any>,
    'data' | 'columns' | 'request'
  > & {
    show?: MaybeRef<boolean>
  }

  // 请求配置
  request?: {
    transformQuery?(ctx: TransformQueryParams<F>): R
    transformResponse?(
      ctx: TransformResponseParams<S, R>
    ): FetchTableDataResult<T>
    fetchPaginationData?(params: R): Promise<S>

    deleteRequest?: (row: T, index: number) => Promise<boolean>

    addRequest?: (form: any) => Promise<boolean>
  }

  /**
   * 点击重置后是否自动调用查询接口
   *
   * @default true
   */
  autoReload?: boolean

  /**
   * 操作列配置
   */
  operates?: CrudOperateOption
}

export interface CrudOperateOption extends ProTableColumnProps<object> {
  buttons?: {
    edit?: CrudOperateButtonOption
    delete?: CrudOperateButtonOption
    view?: CrudOperateButtonOption

    [name: string]: CrudOperateButtonOption | undefined
  }
}

export interface CrudOperateButtonOption {
  show?: MaybeRef<boolean>
  text?: MaybeRef<string>
  order?: MaybeRef<number>
  props?: Omit<ElButtonProps, 'onClick'> & {
    onClick?: (e: MouseEvent, ctx: TableDefaultSlotParams<any>) => void
  }
  confirmType?: 'popconfirm' | 'messagebox' | false
  confirmProps?: CrudDeleteConfirmProps | CrudDeleteMessageBoxProps
}

export type CrudDeleteConfirmProps = Omit<ElPopconfirmProps, 'onConfirm'> & {
  onConfirm?(e: MouseEvent, ctx: TableDefaultSlotParams<any>): void
}

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
 * ProdCrud Column
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

export type ProCrudFormProps = Omit<ProSearchProps<any>, 'columns'>

export type BuildCrudContext = {
  originCtx: any
  optionResult: BuildCrudOptionReturn<any>
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
    addForm: ComputedRef<ElDialogProps>
  }
  options: BuildCrudOption<any, any, any, any, any>
}
