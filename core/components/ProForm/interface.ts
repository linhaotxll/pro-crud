import type {
  Arrayable,
  ExtractMaybeRef,
  JSXElement,
  MaybeRef,
  ValueType,
} from '../common'
import type {
  ActionGroupOption,
  ActionOption,
  CustomActions,
  InternalProButtonGroupOptions,
} from '../ProButton'
import type {
  ColProps,
  FormItemProps,
  TooltipProps,
  FormProps,
  RowProps,
  ButtonProps,
  FormInstance,
} from 'ant-design-vue'
import type {
  NamePath,
  ValidateOptions,
} from 'ant-design-vue/es/form/interface'
import type {
  CSSProperties,
  ComputedRef,
  Ref,
  UnwrapRef,
  VNode,
  VNodeChild,
} from 'vue'

export type Tooltip = TooltipProps & {
  slots?: {
    default?: (style: CSSProperties) => VNode
    title?: () => VNode
  }
}

/**
 * ProForm 作用域
 */
export interface ProFormScope<T extends object> {
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
  reset(prop?: Arrayable<NamePath>): void

  // /**
  //  * 重置表单
  //  *
  //  * @alias reset
  //  */
  // resetFields(name?: NamePath): void

  /**
   * 设置表单字段
   */
  setFieldValue(name: NamePath, value: any): void

  /**
   * 设置多个表单字段
   */
  setFieldValues(values: Record<string, any>): void

  // /**
  //  * 设置多个表单字段，会进行服务端与表单之间的数据转换
  //  */
  // setFieldValuesTransform(values: Record<string, any>): void

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

  // /**
  //  * 触发表单验证
  //  */
  // validateFields(
  //   name?: Arrayable<NamePath> | undefined,
  //   options?: ValidateOptions
  // ): Promise<T | undefined>

  /**
   * 滚动到指定的字段
   */
  scrollToField(name: NamePath, options?: any): void

  /**
   * 清理某个字段的表单验证信息
   */
  clearValidate(nameList?: Arrayable<NamePath>): void

  // /**
  //  * 获取对应字段实例
  //  */
  // getFieldInstance(name: NamePath): FormItemInstance | null

  // /**
  //  * 设置对应字段实例
  //  */
  // setFieldInstance(name: NamePath, value: Ref<FormItemInstance | null>): void

  // /**
  //  * 获取所有字段实例
  //  */
  // getFieldInstances(): Map<NamePath, Ref<FormItemInstance | null>>
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
export interface BuildFormResult<T extends object> {
  proFormRef: Ref<ProFormInstance<T> | null>
  proFormBinding: BuildFormBinding<T>
}

export interface BuildFormBinding<T extends object> {
  row: ComputedRef<RowProps> | undefined
  columns: Ref<Ref<InternalProFormColumnOptions<T>>[]>
  // columns: ComputedRef<InternalProFormColumnOptions<T>>[]
  // labelCol: ComputedRef<ColProps | undefined>
  // wrapperCol: ComputedRef<ColProps | undefined>
  formProps: ComputedRef<FormProps> | undefined
  // actions: ComputedRef<ProFormActionsOptions>
  values: T
  actionGroup:
    | Ref<InternalProButtonGroupOptions & UnwrapRef<ProFormActionGroupExtends>>
    | undefined
  scope: ProFormScope<T>
  formRef: Ref<FormInstance | null>
  // row: ComputedRef<RowProps | undefined>
  // resolvedColumnsMap: Map<
  //   FormItemProps['name'],
  //   InternalProFormColumnOptions<T>
  // >
}

/**
 * buildForm option 返回值
 */
export interface BuildFormOptionResult<
  T extends Record<string, any> = any,
  R extends Record<string, any> = T
> {
  /**
   * 表单额外的配置，不包含 model
   */
  formProps?: MaybeRef<ExtractMaybeRef<Omit<FormProps, 'model'>>>

  /**
   * 表单初始值
   */
  initialValues?: Partial<T>

  /**
   * 通用 row 配置
   */
  row?: MaybeRef<ExtractMaybeRef<RowProps>>

  /**
   * 通用 col 配置
   */
  col?: MaybeRef<ExtractMaybeRef<ColProps>>

  /**
   * 通用 Label Col 配置
   */
  labelCol?: MaybeRef<ExtractMaybeRef<ColProps>>

  /**
   * 通用 Wrapper Col 配置
   */
  wrapperCol?: MaybeRef<ExtractMaybeRef<ColProps>>

  // /**
  //  * 表单被删除时是否保留字段值
  //  */
  // preserve?: boolean
  /**
   * 列配置
   */
  columns?: MaybeRef<ProFormColumnOptions<T>[]>

  /**
   * 按钮组
   */
  action?: MaybeRef<ProFormActionGroup>
  // /**
  //  * 接口调用成功是否需要提示信息
  //  */
  // toast?: SuccessToastOptions
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
  successRequest?: () => void
  /**
   * 表单验证失败
   */
  validateFail?(error: any): void
}

/**
 * Pro Form 按扭组额外配制
 */
export interface ProFormActionGroupExtends {
  col?: MaybeRef<ColProps>
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
  confirm?: MaybeRef<ActionOption>
} & CustomActions

/**
 * 表单实例方法
 */
export type ProFormInstance<T extends object> = ProFormScope<T>

/**
 * 表单列配置
 */
export interface ProFormColumnOptions<T extends object> {
  /**
   * FormItem label
   */
  label?: MaybeRef<string>

  /**
   * FormItem prop，也是表单的字段名，可使用数组嵌套
   */
  name?: MaybeRef<NamePath>

  /**
   * 是否显示整个 FormItem
   *
   * @default true
   */
  show?: MaybeRef<boolean>

  /**
   * 每个 FormItem 所在列配置
   */
  col?: MaybeRef<ExtractMaybeRef<ColProps>>

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
  type?: MaybeRef<ValueType>

  /**
   * 表单额外的 props
   */
  fieldProps?: MaybeRef<ExtractMaybeRef<Record<string, any>>>

  /**
   * 表单插槽
   */
  fieldSlots?: MaybeRef<Record<string, any>>

  /**
   * Form Item 额外的 props
   */
  itemProps?: MaybeRef<ExtractMaybeRef<FormItemProps>>

  /**
   * FormItem 插槽
   */
  itemSlots?: MaybeRef<ProFormItemSlots<T>>

  // /**
  //  * 提示信息
  //  */
  // tooltip?: string | Tooltip

  /**
   * 是否将字段提交
   */
  submitted?: boolean | ((scope: ProFormScope<T>) => boolean)

  /**
   * 表单是否填充满父元素
   *
   * @default true
   */
  fill?: MaybeRef<boolean>

  // /**
  //  * 子控件
  //  */
  // children?: ProFormColumnOptions<T>[]

  // /**
  //  * 列配置
  //  */
  // list?: ProFormListOptions

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
export interface ProFormListOptions {
  /**
   * 新建一行的数据
   *
   * @default {}
   */
  creatorRecord?: () => Record<string, any>

  /**
   * 自定义新建按钮
   */
  renderCreateRecordButton?: (add: (record?: any) => void) => JSXElement

  /**
   * 新建按钮配置
   */
  creatorButtonProps?: (ButtonProps & { creatorButtonText?: string }) | false

  /**
   * 自定义删除按钮
   */
  renderDeleteRecordButton?: (remove: () => void) => JSXElement

  /**
   * 删除按钮配置
   */
  deleteButtonProps?: (ButtonProps & { deleteButtonText?: string }) | false

  /**
   * 自定义复制按钮
   */
  renderCopyRecordButton?: (copy: () => void) => JSXElement

  /**
   * 复制按钮配置
   */
  copyButtonProps?: (ButtonProps & { copyButtonText?: string }) | false

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
export interface InternalProFormColumnOptions<T extends object> {
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
  name?: NamePath | undefined

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
  fieldSlots?: MaybeRef<Record<string, (...args: any) => VNodeChild>>

  /**
   * 列配制
   */
  col?: ColProps | undefined

  /**
   * 表单类型
   */
  type?: ValueType

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

  // /**
  //  * 解析好的字典配置
  //  */
  // dict?: ReturnType<typeof useDictionary>

  // /**
  //  * 解析好的子控件
  //  */
  // children?: ComputedRef<InternalProFormColumnOptions<T>>[]
}

/**
 * Pro Form Item 插槽
 */
interface ProFormItemSlots<T extends object> {
  extra?: (column: InternalProFormColumnOptions<T>) => VNodeChild
  help?: (column: InternalProFormColumnOptions<T>) => VNodeChild
  label?: (column: InternalProFormColumnOptions<T>) => VNodeChild
  tooltip?: (column: InternalProFormColumnOptions<T>) => VNodeChild
}
