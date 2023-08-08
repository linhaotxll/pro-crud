import type {
  ElAutoCompleteProps,
  ElAutoCompleteSlots,
  ElButtonProps,
  ElCascaderProps,
  ElColProps,
  ElFormItemProps,
  ElFormProps,
  ElInputProps,
  ElInputSlots,
  ElRowProps,
  ExtractMaybeRef,
  MaybeRef,
} from '../common'
import type { ValidateFieldsError } from 'async-validator'
import type {
  ElTooltipProps,
  FormInstance,
  FormItemInstance,
  FormItemProp,
  FormValidateCallback,
  FormValidationResult,
  MessageHandler,
  NotificationHandle,
} from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils'
import type { CSSProperties, ComputedRef, InjectionKey, Ref } from 'vue'

type Tooltip = Partial<ElTooltipProps> & {
  slots?: {
    icon?: (iconStyle: CSSProperties) => JSX.Element
    content?: () => JSX.Element
  }
}

export type FieldProps = {
  'auto-complete': ElAutoCompleteProps
  text: ElInputProps
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
  reset(prop?: Arrayable<FormItemProp>): void

  /**
   * 重置表单
   *
   * @alias reset
   */
  resetFields(prop?: Arrayable<FormItemProp>): void

  /**
   * 设置表单字段
   */
  setFieldValue(prop: FormItemProp, value: any): void

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
  getFieldValue(prop: FormItemProp): any

  /**
   * 删除对应字段
   */
  removeFields(prop: FormItemProp): boolean

  /**
   * 对整个表单的内容进行验证
   */
  validate(callback?: FormValidateCallback): FormValidationResult

  /**
   * 验证具体的某个字段
   */
  validateField(
    props?: Arrayable<FormItemProp> | undefined,
    callback?: FormValidateCallback | undefined
  ): FormValidationResult

  /**
   * 滚动到指定的字段
   */
  scrollToField(prop: Arrayable<FormItemProp>): void

  /**
   * 清理某个字段的表单验证信息
   */
  clearValidate(props?: Arrayable<FormItemProp> | undefined): void

  /**
   * 获取对应字段实例
   */
  getFieldInstance(prop: FormItemProp): FormItemInstance | null
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
  row: ComputedRef<ElRowProps>
  col: ComputedRef<ElColProps>
  formProps: ComputedRef<ElFormProps>
  buttons: ComputedRef<ButtonsOption>
  toast: ComputedRef<null | (() => MessageHandler | NotificationHandle)>
  values: T
  scope: ProFormScope<T>
  formRef: Ref<FormInstance | null>
  formItemRef: Map<FormItemProp, Ref<FormItemInstance>>
}

/**
 * buildForm option 返回值
 */
export interface BuildFormOptionResult<T extends object, R = T> {
  /**
   * 表单额外的配置，不包含 model
   */
  formProps?: MaybeRef<ExtractMaybeRef<Omit<ElFormProps, 'model'>>>

  /**
   * 表单初始值
   */
  initialValues?: Partial<T>

  /**
   * 通用每列配置
   */
  col?: MaybeRef<ElColProps>

  /**
   * 通用行配置
   */
  row?: MaybeRef<ElRowProps>

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
  toast?: MaybeRef<
    | false
    | {
        type: SuccessToastType
        props?: any
      }
  >

  request?: {
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
    validateFail?(error: ValidateFieldsError): void
  }
}

/**
 * 表单提交成功提示类型
 */
export type SuccessToastType = 'message' | 'notification'

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
  prop: MaybeRef<FormItemProp>

  /**
   * FormItem 所在列配置
   */
  col?: MaybeRef<ElColProps>

  /**
   * 是否显示整个 FormItem
   *
   * @default true
   */
  show?: MaybeRef<boolean>

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
  fieldProps?: ElInputProps | ElAutoCompleteProps | ElCascaderProps

  /**
   * 表单插槽
   */
  fieldSlots?: ElInputSlots | ElAutoCompleteSlots

  /**
   * Form Item 额外的 props
   */
  itemProps?: ElFormItemProps

  /**
   * FormItem 插槽
   */
  itemSlots?: {
    error?: (error: string) => JSX.Element
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
    from(serverValue: any): any

    /**
     * 表单数据转换为服务端所需要的数据
     *
     * @param formValue 表单字段的值
     *
     * @returns 服务端所需要的值
     */
    to(formValue: any): any
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
   *
   * @default { span: 24 }
   */
  col?: MaybeRef<ElColProps>

  /**
   * 按钮列表
   */
  list?: {
    /**
     * 确认按钮
     */
    confirm?: ButtonOption

    /**
     * 其余按钮
     */
    [type: string]: ButtonOption | undefined
  }
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
  props?: ElButtonProps

  /**
   * 插槽
   */
  slots?: {
    default?: () => JSX.Element
    icon?: () => JSX.Element
    loading?: () => JSX.Element
  }
}

/**
 * 字典配置
 *
 * @internal
 */
export interface DictionaryOption {
  /**
   * 字典列表
   */
  data?: any[]

  /**
   * 动态获取
   */
  fetchData?: () => Promise<any[]>

  /**
   * 名称字段
   *
   * @default 'label'
   */
  labelField?: string

  /**
   * 值字段
   *
   * @default 'value'
   */
  valueField?: string
}

/**
 * @internal
 */
export interface InternalProFormColumnOptions<T extends object>
  extends ProFormColumnOptions<T> {
  /**
   * 循环时用来指定 key 值
   */
  resolvedKey: string

  /**
   * type 自身对应的 props + 自定义传入的 props
   */
  resolvedProps: object | undefined

  /**
   * label 通过 itemProps 合并会传递给 FormItem，防止同名属性传递给表单组件，例如 ElInput
   */
  label: undefined

  /**
   * 同 label
   */
  type: ValueType

  /**
   * tooltip 配置
   */
  tooltip?: Tooltip
}

export type ValueType = 'text' | 'select' | 'auto-complete' | 'cascader'
