import type {
  ProTableColumnActionGroup,
  RenderBodyCellTextParams,
  RenderCustomFilterDropdown,
  RenderCustomFilterIconParams,
  RenderHeaderCellTextParams,
} from './interface'
import type { DataObject, NamePath, ValueType } from '../common'
import type { buildDictionary } from '../ProDictionary'
import type { ColumnType } from 'ant-design-vue/es/table'
import type { VNodeChild } from 'vue'

/**
 * 内部 Table Column 配置
 */
export interface InternalColumnOptions<Data extends DataObject = DataObject> {
  /**
   * 是否显示
   */
  show: boolean

  /**
   * 字段名
   */
  name?: NamePath

  /**
   * 类型
   */
  type?: ValueType

  /**
   * 字典配置
   */
  dictionary?: ReturnType<typeof buildDictionary>

  /**
   * 操作列配置
   */
  action?: ProTableColumnActionGroup

  /**
   * 自定义渲染表头
   */
  renderHeader?(ctx: RenderHeaderCellTextParams<Data>): VNodeChild

  /**
   * 自定义渲染单元格
   */
  renderCell?(ctx: RenderBodyCellTextParams<Data>): VNodeChild

  /**
   * 自定义渲染筛选菜单
   */
  renderFilterDropdown?(ctx: RenderCustomFilterDropdown<Data>): VNodeChild

  /**
   * 自定义渲染筛选图标
   */
  renderFilterIcon?(ctx: RenderCustomFilterIconParams<Data>): VNodeChild
}

/**
 * 解析完成内部 Table Column 配置
 */
export interface InternalProTableColumnProps<Data = any>
  extends ColumnType<Data> {
  /**
   * @private Internal usage.
   */
  _column: InternalColumnOptions
}
