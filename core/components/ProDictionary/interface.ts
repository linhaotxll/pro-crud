import type { MaybeRef } from '../common'
import type { WatchSource } from 'vue'

/**
 * 字典选项
 */
export interface DictionaryOptions<Dictionary = any, Collection = any> {
  /**
   * 数据源
   */
  data?: MaybeRef<Dictionary[]>

  /**
   * 获取数据源
   */
  fetchDictionary?: (...args: any[]) => Dictionary[] | Promise<Dictionary[]>

  /**
   * 从集合中获取数据
   */
  fetchDictionaryInCollection?: (collection: Collection) => Dictionary[]

  /**
   * 字典名称字段
   *
   * @default 'label'
   */
  labelField?: MaybeRef<string>

  /**
   * 字典值字段
   *
   * @default 'value'
   */
  valueField?: MaybeRef<string>

  /**
   * 依赖内容,变化时会将其最为参数重新调用 fetchDictionary
   */
  dependences?: (string | number | (string | number)[])[]
}

/**
 * 字典列配置
 */
export interface DictionaryColumn<Dictionary = any, Collection = any> {
  /**
   * 字典配置
   */
  dict?: MaybeRef<DictionaryOptions<Dictionary, Collection>>
}

/**
 * 字典集合配置
 */
export interface DictionaryCollection<Collection = any> {
  /**
   * 获取字典集合
   */
  fetchDictionaryCollection?: () => Collection | Promise<Collection>
}
