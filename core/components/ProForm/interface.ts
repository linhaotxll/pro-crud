import type { Arrayable, DataObject, NamePath, ValueType } from '../common'
import type {
  ActionGroupOption,
  ActionOption,
  CustomActions,
  InternalProButtonGroupOptions,
} from '../ProButton'
import type {
  buildDictionary,
  DictionaryCollection,
  DictionaryColumn,
} from '../ProDictionary'
import type { ToastOptions } from '../Toast'
import type { DeepMaybeRef } from '@vueuse/core'
import type {
  ColProps,
  FormItemProps,
  FormProps,
  RowProps,
  ButtonProps,
  FormInstance,
  SpaceProps,
} from 'ant-design-vue'
import type { ValidateOptions } from 'ant-design-vue/es/form/interface'
import type {
  ComputedRef,
  MaybeRefOrGetter,
  Ref,
  UnwrapRef,
  VNodeChild,
} from 'vue'

/**
 * ProForm 作用域
 */
export interface ProFormScope<T extends DataObject = DataObject> {
  /**
   * 获取表单值
   */
  getFormValues(): T

  /**
   * 提交表单
   */
  submit(): Promise<void>

  /**
   * 重置表单
   */
  reset(prop?: NamePath[]): void

  /**
   * 设置表单字段
   */
  setFieldValue(name: NamePath, value: any): void

  /**
   * 设置多个表单字段
   */
  setFieldValues(values: Record<string, any>): void

  /**
   * 获取对应字段名的值
   */
  getFieldValue(name: NamePath): any

  /**
   * 删除对应字段
   */
  removeFields(name: NamePath): boolean

  /**
   * 触发表单验证
   */
  validate(
    name?: Arrayable<NamePath> | undefined,
    options?: ValidateOptions
  ): Promise<T | undefined>

  /**
   * 滚动到指定的字段
   */
  scrollToField(name: NamePath, options?: any): void

  /**
   * 清理某个字段的表单验证信息
   */
  clearValidate(nameList?: Arrayable<NamePath>): void
}

/**
 * ProForm props
 * @param T 表单类型
 * @param R 表单提交类型
 */
export type ProFormProps<T extends object> = BuildFormBinding<T>

/**
 * buildForm 返回值
 */
export interface BuildFormResult<T extends DataObject = DataObject> {
  proFormBinding: BuildFormBinding<T>
}

export interface BuildFormBinding<T extends DataObject = DataObject> {
  row: ComputedRef<RowProps> | undefined
  columns: Ref<Ref<InternalProFormColumnOptions<T>>[]>
  formProps: ComputedRef<FormProps> | undefined
  values: T
  actionGroup:
    | Ref<InternalProButtonGroupOptions & UnwrapRef<ProFormActionGroupExtends>>
    | undefined
  scope: ProFormScope<T>
  formRef: Ref<FormInstance | null>
  isInlineLayout: ComputedRef<boolean>
}

/**
 * buildForm option 返回值
 */
export interface BuildFormOptionResult<
  T extends DataObject = DataObject,
  R = T,
  Collection = any
> extends DictionaryCollection<Collection> {
  /**
   * 表单额外的配置，不包含 model
   */
  formProps?: MaybeRefOrGetter<DeepMaybeRef<Omit<FormProps, 'model'>>>

  /**
   * 表单初始值
   */
  initialValues?: Partial<T>

  /**
   * 通用 row 配置
   */
  row?: MaybeRefOrGetter<DeepMaybeRef<RowProps>> | undefined | null

  /**
   * 通用 col 配置
   */
  col?: MaybeRefOrGetter<DeepMaybeRef<ColProps>> | undefined | null

  /**
   * 通用 Label Col 配置
   */
  labelCol?: MaybeRefOrGetter<DeepMaybeRef<ColProps>> | undefined | null

  /**
   * 通用 Wrapper Col 配置
   */
  wrapperCol?: MaybeRefOrGetter<DeepMaybeRef<ColProps>> | undefined | null

  /**
   * 列配置
   */
  columns?: MaybeRefOrGetter<ProFormColumnOptions<T>[]>

  /**
   * 按钮组
   */
  action?: MaybeRefOrGetter<ProFormActionGroup>

  /**
   * 接口调用成功是否需要提示信息
   */
  toast?: ToastOptions

  /**
   * 表单提交前触发，可用来转换提交数据
   */
  beforeSubmit?: (values: T) => R | Promise<R>

  /**
   * 提交表单调用的接口配置
   */
  submitRequest?: (values: R) => Promise<boolean> | boolean

  /**
   * 接口调用成功时（submitRequest 返回 true）调用
   */
  successRequest?: (values: R) => void

  /**
   * 表单验证失败
   */
  validateFail?(error: any): void
}

/**
 * Pro Form 按扭组额外配制
 */
export interface ProFormActionGroupExtends {
  col?: MaybeRefOrGetter<ColProps>
}

/**
 * Pro Form 按钮组
 */
export type ProFormActionGroup = ActionGroupOption<
  ProFormActions,
  ProFormActionGroupExtends
>

/**
 * ProForm 按钮列表
 */
export type ProFormActions = {
  /**
   * 确认按钮
   */
  confirm?: MaybeRefOrGetter<ActionOption>

  /**
   * 重置按钮
   */
  reset?: MaybeRefOrGetter<ActionOption>
} & CustomActions

/**
 * 表单实例方法
 */
export type ProFormInstance<T extends object = any> = ProFormScope<T>

/**
 * 表单列配置
 */
export interface ProFormColumnOptions<
  T extends DataObject = DataObject,
  Dictionary = any,
  Collect = any
> extends DictionaryColumn<Dictionary, Collect> {
  /**
   * FormItem label
   */
  label?: MaybeRefOrGetter<string>

  /**
   * FormItem prop，也是表单的字段名，可使用数组嵌套
   */
  name: MaybeRefOrGetter<NamePath>

  /**
   * 是否显示整个 FormItem
   *
   * @default true
   */
  show?: MaybeRefOrGetter<boolean>

  /**
   * 每个 FormItem 所在列配置
   */
  col?: MaybeRefOrGetter<DeepMaybeRef<ColProps>>

  /**
   * 表单被删除时是否保留字段值
   *
   * @default true
   */
  preserve?: boolean

  /**
   * 表单类型
   *
   * @default 'text'
   */
  type?: MaybeRefOrGetter<ValueType>

  /**
   * 表单额外的 props
   */
  fieldProps?: MaybeRefOrGetter<DeepMaybeRef<Record<string, any>>>

  /**
   * 表单插槽
   */
  fieldSlots?: MaybeRefOrGetter<Record<string, any>>

  /**
   * Form Item 额外的 props
   */
  itemProps?: MaybeRefOrGetter<DeepMaybeRef<FormItemProps>>

  /**
   * FormItem 插槽
   */
  itemSlots?: MaybeRefOrGetter<ProFormItemSlots<T>>

  /**
   * 是否将字段提交
   */
  submitted?: boolean | ((scope: ProFormScope<T>) => boolean)

  /**
   * 表单是否填充满父元素
   *
   * @default true
   */
  fill?: MaybeRefOrGetter<boolean>

  /**
   * 列配置
   */
  list?: MaybeRefOrGetter<ProFormListOptions>

  /**
   * 服务端数据转换
   */
  transform?: {
    /**
     * 从服务端接收到的数据转换为表单数据
     *
     * @param serverValue 服务端传递的值
     *
     * @returns 表单所需要的值
     */
    from?(serverValue: any): any

    /**
     * 表单数据转换为服务端所需要的数据
     *
     * @param formValue 表单字段的值
     *
     * @returns 服务端所需要的值
     */
    to?(formValue: any): any
  }
}

/**
 * 列表配置
 */
export interface ProFormListOptions<C extends object = any> {
  /**
   * 子控件
   */
  children?: MaybeRefOrGetter<ProFormColumnOptions<C>[]>

  /**
   * 每行 Space Props
   */
  space?: MaybeRefOrGetter<SpaceProps>

  /**
   * 新建一行的数据
   *
   * @default {}
   */
  creatorRecord?: () => Record<string, any>

  /**
   * 自定义新建按钮
   */
  renderCreateRecordButton?: (add: (record?: any) => void) => VNodeChild

  /**
   * 新建按钮配置
   */
  creatorButtonProps?: MaybeRefOrGetter<
    (ButtonProps & { creatorButtonText?: string }) | false
  >

  /**
   * 自定义删除按钮
   */
  renderDeleteRecordButton?: (remove: () => void) => VNodeChild

  /**
   * 删除按钮配置
   */
  deleteButtonProps?: MaybeRefOrGetter<
    (ButtonProps & { deleteButtonText?: string }) | false
  >

  /**
   * 自定义复制按钮
   */
  renderCopyRecordButton?: (copy: () => void) => VNodeChild

  /**
   * 复制按钮配置
   */
  copyButtonProps?: MaybeRefOrGetter<
    (ButtonProps & { copyButtonText?: string }) | false
  >

  /**
   * 最少条目
   *
   * @default Number.MIN_VALUE
   */
  min?: number

  /**
   * 最大条目
   *
   * @default Number.MAX_VALUE
   */
  max?: number
}

/**
 * @internal
 */
export interface InternalProFormColumnOptions<
  T extends DataObject = DataObject
> {
  /**
   * 显示状态,其余属性只会在显示下才会存在
   */
  show: boolean

  /**
   * 循环时用来指定 key 值
   */
  key?: string | number

  /**
   * 表单域字段
   */
  name: NamePath

  /**
   * Form Item Props
   */
  itemProps?: FormItemProps | undefined

  /**
   * Pro Form Item Slots
   */
  itemSlots?: ProFormItemSlots<T>

  /**
   * 表单项 Props
   */
  fieldProps?: Record<string, any> | undefined

  /**
   * 表单项 Slots
   */
  fieldSlots?: MaybeRefOrGetter<Record<string, (...args: any) => VNodeChild>>

  /**
   * 列配制
   */
  col?: ColProps | undefined

  /**
   * 表单类型
   */
  type: ValueType

  /**
   * 是否将字段提交
   */
  submitted?: ProFormColumnOptions<T>['submitted']

  /**
   * 服务端数据转换
   */
  transform?: ProFormColumnOptions<T>['transform']

  /**
   * 是否填满父元素
   */
  fill?: boolean

  /**
   * 表单被删除时是否保留字段值
   */
  preserve?: boolean

  /**
   * 字典配置
   */
  dictionary?: ReturnType<typeof buildDictionary>

  /**
   * 列配置
   */
  list?: Ref<
    | {
        /**
         * 子控件
         */
        children?: Ref<InternalProFormColumnOptions<T>>[] | undefined

        /**
         * 每行 Space Props
         */
        space?: SpaceProps

        /**
         * 新建一行的数据
         */
        creatorRecord?: ProFormListOptions['creatorRecord']

        /**
         * 自定义新建按钮
         */
        renderCreateRecordButton?: ProFormListOptions['renderCreateRecordButton']

        /**
         * 新建按钮配置
         */
        creatorButtonProps?:
          | (ButtonProps & { creatorButtonText?: string })
          | false

        /**
         * 自定义删除按钮
         */
        renderDeleteRecordButton?: ProFormListOptions['renderDeleteRecordButton']

        /**
         * 删除按钮配置
         */
        deleteButtonProps?:
          | (ButtonProps & { deleteButtonText?: string })
          | false

        /**
         * 自定义复制按钮
         */
        renderCopyRecordButton?: ProFormListOptions['renderCopyRecordButton']

        /**
         * 复制按钮配置
         */
        copyButtonProps?: (ButtonProps & { copyButtonText?: string }) | false

        /**
         * 最少条目
         */
        min?: number

        /**
         * 最大条目
         */
        max?: number
      }
    | undefined
  >
}

/**
 * Pro Form Item 插槽
 */
interface ProFormItemSlots<T extends DataObject = DataObject> {
  extra?: (column: InternalProFormColumnOptions<T>) => VNodeChild
  help?: (column: InternalProFormColumnOptions<T>) => VNodeChild
  label?: (column: InternalProFormColumnOptions<T>) => VNodeChild
  tooltip?: (column: InternalProFormColumnOptions<T>) => VNodeChild
}
