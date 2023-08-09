import type {
  CrudDialogOption,
  TransformQueryParams,
  TransformResponseParams,
} from './components/ProCrud'
import type { FetchTableDataResult } from './components/ProTable'
import type { InjectionKey } from 'vue'

export const GlobalOption = Symbol() as InjectionKey<ProComponentsOptions>

export interface ProComponentsOptions {
  /**
   * 全局转换请求前的参数
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
  ): FetchTableDataResult<any>

  /**
   * 全局 crud 添加、编辑、查看弹窗公共配置
   */
  dialog?: CrudDialogOption
}
