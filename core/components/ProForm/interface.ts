import type {
  Arrayable,
  DictionaryOption,
  ExtractMaybeRef,
  MaybeRef,
  ResolvedColumnDict,
  ValueType,
} from '../common'
import type {
  ColProps,
  FormItemProps,
  TooltipProps,
  FormInstance,
  FormItemInstance,
  FormProps,
  ButtonProps,
  SpaceProps,
  RowProps,
  MessageArgsProps,
} from 'ant-design-vue'
import type {
  NamePath,
  ValidateOptions,
} from 'ant-design-vue/es/form/interface'
import type { NotificationArgsProps } from 'ant-design-vue/es/notification'
import type { CSSProperties, ComputedRef, Ref } from 'vue'

type Tooltip = TooltipProps & {
  slots?: {
    default?: (style: CSSProperties) => JSX.Element
    title?: () => JSX.Element
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

  /**
   * 重置表单
   *
   * @alias reset
   */
  resetFields(name?: NamePath): void

  /**
   * 设置表单字段
   */
  setFieldValue(name: NamePath, value: any): void

  /**
   * 设置多个表单字段
   */
  setFieldValues(values: Record<string, any>): void

  /**
   * 设置多个表单字段，会进行服务端与表单之间的数据转换
   */
  setFieldValuesTransform(values: Record<string, any>): void

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
   * 触发表单验证
   */
  validateFields(
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

  /**
   * 获取对应字段实例
   */
  getFieldInstance(name: NamePath): FormItemInstance | null
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
  columns: ComputedRef<InternalProFormColumnOptions<T>>[]
  labelCol: ComputedRef<ColProps | undefined>
  wrapperCol: ComputedRef<ColProps | undefined>
  formProps: ComputedRef<FormProps>
  buttons: ComputedRef<ButtonsOption>
  values: T
  scope: ProFormScope<T>
  formRef: Ref<FormInstance | null>
  formItemRef: Map<NamePath, Ref<FormItemInstance | null>>
  row: ComputedRef<RowProps | undefined>
  resolvedColumnsMap: Map<
    FormItemProps['name'],
    InternalProFormColumnOptions<T>
  >
}

/**
 * buildForm option 返回值
 */
export interface BuildFormOptionResult<T extends object, R = T> {
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
  row?: MaybeRef<RowProps>

  /**
   * 通用 col 配置
   */
  col?: MaybeRef<ColProps>

  /**
   * 通用 Label Col 配置
   */
  labelCol?: MaybeRef<ColProps>

  /**
   * 通用 Wrapper Col 配置
   */
  wrapperCol?: MaybeRef<ColProps>

  /**
   * 表单被删除时是否保留字段值
   */
  preserve?: boolean

  /**
   * 列配置
   */
  columns?: ProFormColumnOptions<T>[]

  /**
   * 按钮组
   */
  buttons?: ButtonsOption

  /**
   * 接口调用成功是否需要提示信息
   */
  toast?: SuccessToastOptions

  /**
   * 表单提交前触发，可用来转换提交数据
   */
  beforeSubmit?: (values: T) => R | Promise<R>

  /**
   * 提交表单调用的接口配置
   */
  submitRequest?: (values: R) => Promise<boolean>

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
 * 表单提交成功提示类型
 */
export type SuccessToastType = 'message' | 'notification'

export type SuccessToastOptions =
  | false
  | {
      type: 'message'
      props?: MessageArgsProps
    }
  | {
      type: 'notification'
      props?: NotificationArgsProps
    }

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
  name?: MaybeRef<FormItemProps['name']>

  /**
   * 是否显示整个 FormItem
   *
   * @default true
   */
  show?: MaybeRef<boolean>

  /**
   * 每个 FormItem 所在列配置
   */
  col?: MaybeRef<ColProps>

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
  type?: MaybeRef<ValueType | any>

  /**
   * 表单额外的 props
   */
  fieldProps?: any

  /**
   * 表单插槽
   */
  fieldSlots?: any

  /**
   * Form Item 额外的 props
   */
  itemProps?: ExtractMaybeRef<FormItemProps>

  /**
   * FormItem 插槽
   */
  itemSlots?: {
    error?: (error: string) => JSX.Element
    help?: () => JSX.Element
    label?: (column: InternalProFormColumnOptions<T>) => JSX.Element
  }

  /**
   * 字典配置
   */
  dict?: DictionaryOption

  /**
   * 提示信息
   */
  tooltip?: string | Tooltip

  /**
   * 是否将字段提交
   *
   * @default true
   */
  submitted?: boolean | ((scope: ProFormScope<T>) => boolean)

  /**
   * 表单是否填充满父元素
   *
   * @default true
   */
  fill?: MaybeRef<boolean>

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
 * 按钮组配置
 */
export interface ButtonsOption {
  /**
   * 是否显示按钮组
   *
   * @default true
   */
  show?: MaybeRef<boolean>

  /**
   * 按钮列配置
   */
  col?: MaybeRef<ColProps>

  /**
   * 按钮间距配置
   */
  space?: MaybeRef<SpaceProps>

  /**
   * 按钮列表
   */
  list?: ProFormButtons
}

export interface ProFormButtons {
  /**
   * 确认按钮
   */
  confirm?: ButtonOption

  /**
   * 其余按钮
   */
  [type: string]: ButtonOption | undefined
}

/**
 * 按钮配置
 */
export interface ButtonOption {
  /**
   * 是否显示
   *
   * @default trues
   */
  show?: MaybeRef<boolean>

  /**
   * 按钮文本
   */
  text?: string

  /**
   * 按钮 props
   */
  props?: ButtonProps

  /**
   * 插槽
   */
  slots?: {
    default?: () => JSX.Element
    icon?: () => JSX.Element
  }
}

/**
 * @internal
 */
export interface InternalProFormColumnOptions<T extends object>
  extends Omit<ProFormColumnOptions<T>, 'dict'> {
  /**
   * 循环时用来指定 key 值
   */
  resolvedKey: string | number | undefined

  /**
   * type 自身对应的 props + 自定义传入的 props
   */
  resolvedProps: object | undefined

  /**
   * label 解绑 ref
   */
  label: string | undefined

  /**
   * 同 label
   */
  type: ValueType

  /**
   * tooltip 配置
   */
  tooltip?: Tooltip

  /**
   * 解析好的字典配置
   */
  dict?: ResolvedColumnDict
}
