import type {
  EditableKeys,
  ProTableColumnActionGroup,
  ProTableEditableColumnActionGroup,
  RenderBodyCellTextParams,
  RenderCustomFilterDropdown,
  RenderCustomFilterIconParams,
  RenderHeaderCellTextParams,
} from './interface'
import type { DataObject, NamePath, ValueType } from '../common'
import type { buildDictionary } from '../ProDictionary'
import type { BuildFormBinding, ProFormScope } from '../ProForm'
import type { ToastOptions } from '../Toast'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { ColumnType } from 'ant-design-vue/es/table'
import type { VNodeChild } from 'vue'

/**
 * 内部 Table Column 配置
 */
export interface InternalColumnOptions<Data extends DataObject = DataObject> {
  /**
   * 索引
   */
  columnIndex: number

  /**
   * 是否显示
   */
  show: boolean

  /**
   * 字段名
   */
  name: NamePath | undefined

  /**
   * 类型
   */
  type: ValueType

  /**
   * 是否可编辑
   */
  editable?: boolean | ((ctx: RenderBodyCellTextParams<Data>) => boolean)

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

/**
 * 解析后的编辑配置
 */
export type InternalProTableEditableOptions<Data extends DataObject = any> =
  | false
  | {
      type: 'single' | 'multiple'
      action: ProTableEditableColumnActionGroup<RenderBodyCellTextParams<Data>>
      saveToast: ToastOptions
      removeToast: ToastOptions
      onlyEditOneLineToast: ToastOptions
      editableKeys?: EditableKeys
      editFormBinding: BuildFormBinding<Data>
      formScope: ProFormScope<Data>
      saveRequest?: (
        data: Partial<Data>,
        ctx: RenderBodyCellTextParams<Data>
      ) => Promise<boolean> | boolean
    }

export type InternalEditableKeys = Map<Key, true | NamePath[]>
