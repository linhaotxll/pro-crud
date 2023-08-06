import type { MaybeRef } from '../common'
import type {
  BuildFormOptionResult,
  ProFormColumnOptions,
  ProFormInstance,
} from '../ProForm'
import type {
  BuildSearchBinding,
  ProSearchInstance,
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
  ProTableProps,
  ProTableScope,
} from '../ProTable'
import type { ComputedRef, Ref } from 'vue'

/**
 * ProCrud props
 *
 * @param T 表格数据
 * @param S 分页接口实际返回数据
 * @param F 查询表单数据
 * @param R 查询表单传递数据
 */
export type ProCrudProps = BuildCrudBinding
// export interface ProCrudProps<
//   T extends object,
//   S extends object = any,
//   F extends object = any,
//   R extends object = F
// > {
//   /**
//    * 通用列配置，会在 table、search、addForm、editForm、viewForm 中展示
//    */
//   columns?: ProCrudColumnOption<any>[]

//   /**
//    * 查询表单配置
//    */
//   search?: ProCrudFormProps

//   /**
//    * 添加表单配置
//    */
//   addForm?: ProCrudFormProps

//   /**
//    * 编辑表单配置
//    */
//   editForm?: ProCrudFormProps

//   /**
//    * 详情表单配置
//    */
//   viewForm?: ProCrudFormProps

//   /**
//    * 表格配置
//    */
//   table?: Omit<ProTableProps<T>, 'data' | 'fetchTableData' | 'columns'>

//   /**
//    * 请求配置
//    */
//   request: ProCrudRequest<T, S, F, R>
// }

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
  // search: ProSearchScope<any>
  // table: ProTableScope<any>
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
  proSearchBinding: BuildSearchBinding<any>

  /**
   * 是否显示 table
   */
  tableShow: ComputedRef<boolean>

  /**
   * table 配置
   */
  proTableBinding: BuildProTableBinding<any>
}

/**
 * buildCrud option 返回值
 */
export interface BuildCrudOptionReturn<
  T extends object,
  S extends object = FetchTableDataResult<T>,
  F extends object = any,
  R extends object = any
> {
  columns?: ProCrudColumnOption<any>[]

  search?: Omit<BuildFormOptionResult<any>, 'columns' | 'request'> & {
    show?: MaybeRef<boolean>
  }

  table?: Omit<
    BuildProTableOptionResult<any>,
    'data' | 'columns' | 'request'
  > & {
    show?: MaybeRef<boolean>
  }

  request?: {
    transformQuery?(ctx: TransformQueryParams<F>): R
    transformResponse?(
      ctx: TransformResponseParams<S, R>
    ): FetchTableDataResult<T>
    fetchPaginationData?(params: R): Promise<S>
  }

  /**
   * 点击重置后是否自动调用查询接口
   *
   * @default true
   */
  autoReload?: boolean
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
