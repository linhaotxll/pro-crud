import type { ActionOption, ActionsOption } from '../ProButton'
import type {
  BuildFormBinding,
  BuildFormOptionResult,
  ProFormActionCommon,
  ProFormActions,
  ProFormScope,
} from '../ProForm'
import type { Ref } from 'vue'

export type ProSearchProps<T extends object> = BuildSearchBinding<T>

/**
 * ProSearch 作用域
 */
export type ProSearchScope<T extends object> = ProFormScope<T>

/**
 * ProSearch 实例
 */
export type ProSearchInstance<T extends object> = ProSearchScope<T>

/**
 * buildSearch 返回需要绑定的 props
 */
export type BuildSearchBinding<T extends object> = BuildFormBinding<T>

/**
 * buildSearch 返回值
 */
export interface BuildSearchResult<T extends object> {
  proSearchRef: Ref<ProSearchInstance<T> | null>
  proSearchBinding: BuildSearchBinding<T>
}

/**
 * buildSearch option 返回值
 */
export type BuildSearchOptionResult<T extends object, R = T> = Omit<
  BuildFormOptionResult<T, R>,
  'actions'
> & { actions: ProSearchActionsOptions }

/**
 * ProSearch 操作
 */
export interface ProSearchOptions extends ProFormActions {
  /**
   * 取消按钮
   */
  cancel?: ActionOption
}

export interface ProSearchActionsOptions
  extends ProFormActionCommon,
    ActionsOption<ProSearchOptions> {}
