import type { DataObject } from '../common'
import type {
  BuildModalFormOptionReturn,
  ModalFormBinding,
  ModalFormScope,
} from '../ModalForm'
import type { ActionGroupOption, ActionOption } from '../ProButton'
import type { ProFormColumnOptions, ProFormScope } from '../ProForm'
import type {
  BuildProTableOptionResult,
  BuildTableBinding,
  FetchTableListRequest,
  ProInnerFormOptions,
  ProTableColumnProps,
  ProTableScope,
  ProTableToolbarActions,
  RenderBodyCellTextParams,
} from '../ProTable'
import type { ToastOptions } from '../Toast'
import type { MaybeRefOrGetter } from 'vue'

/**
 * ProCrud 作用域
 */
export interface ProCrudScope<Data extends DataObject = DataObject> {
  search: ProFormScope<Partial<Data>>
  table: ProTableScope<Data>
  modal: ProCrudModalScope<Data>
}

/**
 * Pro Crud Modal 作用域
 */
export type ProCrudModalScope<Data extends DataObject = DataObject> = Omit<
  ModalFormScope<Partial<Data>>,
  'showModal'
> & {
  showEditModal(record: Data): void
  showAddModal(): void
  showViewModal(record: Data): void
}

/**
 * buildCrud option 返回值
 */
export interface BuildCrudOptionReturn<
  Data extends DataObject = DataObject,
  Params = any,
  Collection = any,
  SearchForm extends DataObject = DataObject
> extends Omit<
      BuildProTableOptionResult<Data, Params, Collection, SearchForm>,
      'columns' | 'fetchTableData' | 'actionColumn' | 'toolbar'
    >,
    Omit<BuildModalFormOptionReturn, 'renderTrigger'> {
  /**
   * 列配置
   */
  columns?: ProCrudColumnOption<Data, any, Collection>[]

  /**
   * 列按钮组
   */
  actionColumn?: MaybeRefOrGetter<ProCrudActionColumnOptions>

  /**
   * toolbar 配置
   */
  toolbar?: MaybeRefOrGetter<ProCrudToolbarActionGroup>

  /**
   * 添加表单配置
   */
  addForm?: MaybeRefOrGetter<ProInnerFormOptions<Partial<Data>, Collection>>

  /**
   * 编辑表单配置
   */
  editForm?: MaybeRefOrGetter<ProInnerFormOptions<Partial<Data>, Collection>>

  /**
   * 查看表单配置
   */
  viewForm?: MaybeRefOrGetter<ProInnerFormOptions<Partial<Data>, Collection>>

  /**
   * 点击重置后是否自动调用查询接口
   *
   * @default true
   */
  autoReload?: boolean

  /**
   * 删除成功提示
   *
   * @default '删除成功'
   */
  deleteToast?: ToastOptions

  /**
   * 新增成功提示
   *
   * @default '新增成功'
   */
  addToast?: ToastOptions

  /**
   * 编辑成功提示
   *
   * @default '编辑成功'
   */
  editToast?: ToastOptions

  /**
   * 获取数据请求
   */
  fetchTableData?: FetchTableListRequest<Data, Params>

  /**
   * 删除接口
   *
   * @param row 行数据
   * @returns {boolean} 删除是否成功，返回 true 会有提示信息
   */
  deleteRequest?: (
    options: RenderBodyCellTextParams<Data>
  ) => Promise<boolean> | boolean

  /**
   * 添加接口
   *
   * @param form 编辑表单数据
   * @returns {boolean} 添加是否成功，返回 true 会有提示信息
   */
  addRequest?: (form: Partial<Data>) => Promise<boolean> | boolean

  /**
   * 编辑接口
   *
   * @param form 编辑表单数据 + 行数据
   * @returns {boolean} 编辑是否成功，返回 true 会有提示信息
   */
  editRequest?: (form: Partial<Data>) => Promise<boolean> | boolean
}

/**
 * Pro Crud 操作列
 */
export type ProCrudActionColumnOptions<Data extends DataObject = DataObject> =
  ProTableColumnProps<Data> & {
    action?: ProCrudActionColumnGroup<Data>
  }

/**
 * Pro Crud Toolbar 按钮组
 */
export type ProCrudToolbarActionGroup = ActionGroupOption<
  ProCrudToolbarActions,
  {}
>

/**
 * Pro Crud Toolbar 按扭
 */
export interface ProCrudToolbarActions extends ProTableToolbarActions {
  /**
   * 新增按扭
   */
  add: MaybeRefOrGetter<ActionOption>
}

/**
 * Pro Crud 操作列按钮组
 */
export type ProCrudActionColumnGroup<Data extends DataObject = DataObject> =
  ActionGroupOption<
    ProCrudActionColumnActions<RenderBodyCellTextParams<Data>>,
    {}
  >

/**
 * Pro Crud 列按钮
 */
export type ProCrudActionColumnActions<C = any> = {
  /**
   * 查看
   */
  view?: MaybeRefOrGetter<ActionOption<C>>

  /**
   * 编辑
   */
  edit?: MaybeRefOrGetter<ActionOption<C>>

  /**
   * 删除
   */
  delete?: MaybeRefOrGetter<ActionOption<C>>

  /**
   * 自定义按钮
   */
  [name: string]: MaybeRefOrGetter<ActionOption<C>> | undefined
}

/**
 * 弹窗类型
 */
export const enum ModalType {
  /**
   * 新增
   */
  Add,

  /**
   * 编辑
   */
  Edit,

  /**
   * 查看
   */
  View,
}

export interface BuildCrudContext<
  Data extends DataObject = DataObject,
  Collection = any
> {
  options(scope: ProCrudScope<Data>): BuildCrudOptionReturn<Data, Collection>
  optionResult: BuildCrudOptionReturn<Data, Collection>
  scope: ProCrudScope<Data>
  modalColumns: {
    add: ProCrudColumnOption[]
    edit: ProCrudColumnOption[]
    view: ProCrudColumnOption[]
  }
  tableBinding: BuildTableBinding<Data>
  modalFormBinding: ModalFormBinding<Partial<Data>>
}

/**
 * ProdCrud Column 配置
 */
export interface ProCrudColumnOption<
  Data extends DataObject = any,
  Dictionary = any,
  Collection = any
> extends ProTableColumnProps<Data, Dictionary, Collection> {
  /**
   * 添加表单列配置
   */
  addForm?: MaybeRefOrGetter<ProCrudFromOptions<Data, Dictionary, Collection>>

  /**
   * 编辑表单列配置
   */
  editForm?: MaybeRefOrGetter<ProCrudFromOptions<Data, Dictionary, Collection>>

  /**
   * 详情表单列配置
   */
  viewForm?: MaybeRefOrGetter<ProCrudFromOptions<Data, Dictionary, Collection>>
}

/**
 * Pro Crud 表单列配置
 */
export type ProCrudFromOptions<
  Data extends DataObject = any,
  Dictionary = any,
  Collection = any
> = Omit<ProFormColumnOptions<Data, Dictionary, Collection>, 'dict' | 'type'>

/**
 * Pro Crud Binding
 */
export interface ProCrudBinding<Data extends DataObject = DataObject> {
  tableBinding: BuildTableBinding<Data, DataObject>
  modalFormBinding: ModalFormBinding<Partial<Data>>
}

/**
 * buildCrud 返回值
 */
export interface BuildCrudResult<Data extends DataObject = DataObject> {
  proCrudBinding: ProCrudBinding<Data>
}
