import type { ValueType, ValueTypeValue } from './components/common'
import type { CustomRender } from './components/CustomRender'
import type { BuildCrudOptionReturn } from './components/ProCrud'
import type {
  FetchProTablePageListQuery,
  FetchTableListRequest,
} from './components/ProTable'
import type { ToastOptions } from './components/Toast'
import type { FlexProps, TableProps } from 'ant-design-vue'

export interface ProComponentsOptions {
  /**
   * 全局转换请求前的参数
   *
   * @param {TransformQueryParams} ctx 查询参数，包含分页，搜索条件
   * @returns 转换后的参数，直接传递给 fetchPaginationData 请求
   */
  transformQuery?(ctx: FetchProTablePageListQuery<any>): any

  /**
   * 转换请求后的响应数据
   *
   * @param {TransformResponseParams} ctx 响应参数，包含响应数据、查询数据
   */
  transformResponse?(ctx: any): ReturnType<FetchTableListRequest>

  /**
   * 全局包裹组件配置
   */
  wrapperProps?: FlexProps

  /**
   * 全局 Table 组件配置
   */
  tableProps?: Omit<TableProps, 'dataSource' | 'loading' | 'columns'>

  /**
   * 全局 Toolbar 配置
   */
  crudOptions?: BuildCrudOptionReturn

  /**
   * 全局弹窗
   */
  modal?: CustomRender
  // toolbar?: ProCrudToolbarActionGroup

  // /**
  //  * 全局 crud 添加、编辑、查看弹窗公共配置
  //  */
  // dialog?: CrudDialogOption

  // /**
  //  * 全局分页配置
  //  */
  // pagination?: PaginationProps

  /**
   * 注入扩展类型
   */
  types?: Record<string, ValueTypeValue>

  // /**
  //  * 全局执行 build hooks
  //  */
  // hooks?: {
  //   /**
  //    * 执行 buildTable 时执行
  //    */
  //   table?: (ctx: {
  //     proTableScope: ProTableScope<any>
  //     proTableBinding: BuildProTableBinding<any>
  //     proTableRef: Ref<ProTableInstance<any> | null>
  //   }) => void

  //   /**
  //    * 执行 buildForm 时执行
  //    */
  //   form?: (ctx: {
  //     proFormScope: ProFormScope<any>
  //     proFormBinding: BuildFormBinding<any>
  //   }) => void

  //   /**
  //    * 执行 buildCrud 时执行
  //    */
  //   crud?: (ctx: {
  //     proCrudScope: ProCrudScope<any, any, any, any>
  //     proCrudBinding: BuildCrudBinding<any, any, any, any>
  //   }) => void
  // }

  // /**
  //  * 全局 crud 配置
  //  */
  // crud?: {
  //   /**
  //    * 按钮组配置
  //    */
  //   action?: CrudActionOption<any>
  // }

  /**
   * 全局 toast 配置
   */
  toast?: ToastOptions
}

export interface ResolvedProComponentsOptions
  extends Omit<ProComponentsOptions, 'types'> {
  types: Record<ValueType, ValueTypeValue>
}
