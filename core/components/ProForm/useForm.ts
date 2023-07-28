import { ElMessage, ElNotification, type FormInstance } from 'element-plus'
import { cloneDeep, get, has, merge, set, unset } from 'lodash-es'
import { computed, inject, provide, ref, toRaw, unref } from 'vue'

import {
  DefaultFormFieldType,
  DefaultPreserve,
  FormItemRefKey,
  ProFormScopeKey,
  ShowButton,
} from './constant'
import { valueTypeMap } from './type'
import { useScope } from './useScope'

import type {
  ButtonsOption,
  InternalProFormColumnOptions,
  ProFormOptions,
  SuccessToastType,
  ValueType,
} from './interface'
import type {
  FormItemInstance,
  FormItemProp,
  FormValidateCallback,
  FormValidationResult,
  MessageParams,
  NotificationParams,
} from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils'
import type { Ref } from 'vue'

export function useForm<T extends object, R = T>(
  props: ProFormOptions<T, R>,
  values: T
) {
  // 自动生成作用域对象
  const generateScope = () => {
    const { scope } = useScope(
      () => values,
      () => result
    )

    return scope
  }
  const scope = inject(ProFormScopeKey, generateScope, true)

  // el-form ref
  const formRef = ref<FormInstance | null>(null)

  // 通用 el-col 配置
  const formCol = unref(props.col)

  const formItemRef = new Map<FormItemProp, Ref<FormItemInstance>>()

  const resolvedColumnsMap = new Map<
    FormItemProp,
    InternalProFormColumnOptions<T>
  >()
  const resolvedColumns = props.columns.map(column => {
    return computed(() => {
      // 默认 type 类型
      const defaultType: ValueType = unref(column.type ?? DefaultFormFieldType)

      // 最终给表单传递的 props 集合：type 对应的 props + 用户传入的 props
      const resolvedProps: object | undefined = {
        ...valueTypeMap[defaultType][1],
        ...column.fieldProps,
      }

      const result: InternalProFormColumnOptions<T> = {
        ...column,
        label: undefined,
        submitted: column.submitted ?? true,
        preserve:
          (column.preserve != null ? column.preserve : props.preserve) ??
          DefaultPreserve,
        resolvedKey:
          typeof column.prop === 'string' ? column.prop : column.prop.join('.'),
        itemProps: {
          label: unref(column.label),
          prop: column.prop,
          ...column.itemProps,
        },
        tooltip: column.tooltip
          ? typeof column.tooltip === 'string'
            ? { content: column.tooltip }
            : column.tooltip
          : undefined,
        col: {
          ...formCol,
          ...unref(column.col),
        },
        type: defaultType,
        resolvedProps,
        show: unref(column.show ?? true),
      }

      resolvedColumnsMap.set(result.prop, result)

      return result
    })
  })

  const defaultButtons = {
    show: true,
    col: { span: 24 },
    list: {
      confirm: {
        show: true,
        text: '提交',
        props: { type: 'primary', onClick: scope.submit },
      },
    },
  }

  // 解析按钮组配置
  const resolvedButtons = computed(() => {
    const buttons = merge({}, defaultButtons, props.buttons)

    const result: ButtonsOption = buttons
      ? {
          show: unref(buttons.show),
          col: unref(buttons.col),
          list: Object.keys(buttons.list ?? {}).reduce<ButtonsOption['list']>(
            (prev, curr) => {
              prev![curr] = {
                ...buttons.list![curr],
                show: unref(buttons.list![curr]?.show ?? ShowButton),
              }
              return prev
            },
            {}
          ),
        }
      : {}
    return result
  })

  // 解析提示配置
  const resolvedToast = computed(() => {
    const toast = unref(props.toast ?? { type: 'message' as SuccessToastType })
    if (toast === false) {
      return null
    }

    let type: SuccessToastType = 'message'
    let toastProps: MessageParams | NotificationParams = {
      type: 'success',
      message: '提交成功',
    }

    type = toast.type
    toastProps = merge(toastProps, toast.props)

    return () =>
      type === 'message'
        ? ElMessage(toastProps as MessageParams)
        : ElNotification(toastProps as NotificationParams)
  })

  provide(FormItemRefKey, formItemRef)

  /**
   * 提交表单
   * @returns
   */
  async function submit() {
    // 验证
    const validated = validate()
    if (!validated) {
      return
    }

    // 数据转换
    const params = await beforeSubmit(values)

    // 调用接口
    const result = (await props.submitRequest?.(params)) ?? false

    // 提示
    const showToast = resolvedToast.value
    if (showToast !== null) {
      if (result) {
        showToast()
      }
    }
  }

  /**
   * 提交表单前参数处理
   */
  async function beforeSubmit(values: T) {
    const params = cloneDeep(toRaw(values))

    for (const column of resolvedColumns) {
      const { submitted, prop, transform } = column.value

      // 检测字段是否需要提交上传
      if (
        submitted === false ||
        (typeof submitted === 'function' && submitted(scope) === false)
      ) {
        unset(params, prop)
        continue
      }

      // 表单数据转换为服务端数据
      if (typeof transform?.to === 'function') {
        set(params, prop, transform.to(get(params, prop)))
      }
    }

    // 调用用户自定义的处理参数函数
    return (typeof props.beforeSubmit === 'function'
      ? await props.beforeSubmit(params)
      : params) as unknown as R
  }

  /**
   * 重置表单
   */
  function reset(prop?: Arrayable<FormItemProp>) {
    formRef.value?.resetFields(prop)
    const initialValues = props.initialValues

    // 删除多余属性，确保必须是 initialValue
    Object.keys(values).forEach(key => {
      if (!has(initialValues, key)) {
        removeFields(key)
      }
    })
  }

  /**
   * 重置表单
   */
  function resetFields(prop?: Arrayable<FormItemProp>) {
    return reset(prop)
  }

  /**
   * 设置表单
   */
  function setFieldValue(key: FormItemProp, value: any, transformed = false) {
    if (transformed) {
      const column = resolvedColumnsMap.get(key)
      if (column) {
        if (typeof column.transform?.from === 'function') {
          value = column.transform.from(value)
        }
      }
    }
    set(values, key, value)
  }

  /**
   * 设置表单多个值
   */
  function setFieldValues(values: Record<string, any>, transformed = false) {
    Object.keys(values).forEach(key => {
      setFieldValue(key, values[key], transformed)
    })
  }

  /**
   * 设置表单多个值，会进行服务端与表单之间的数据转换
   */
  function setFieldValuesTransform(values: Record<string, any>) {
    return setFieldValues(values, true)
  }

  /**
   * 获取对应字段名的值
   */
  function getFieldValue(prop: FormItemProp) {
    return get(values, prop)
  }

  /**
   * 删除对应字段
   */
  function removeFields(prop: FormItemProp) {
    return unset(values, prop)
  }

  /**
   * 对整个表单的内容进行验证
   */
  async function validate(
    callback?: FormValidateCallback
  ): FormValidationResult {
    try {
      const validated = (await formRef.value?.validate(callback)) ?? false
      if (!validated) {
        return validated
      }
    } catch (e: any) {
      props.validateFail?.(e)
    }
    return true
  }

  /**
   * 验证具体的某个字段
   */
  async function validateField(
    prop?: Arrayable<FormItemProp> | undefined,
    callback?: FormValidateCallback | undefined
  ): FormValidationResult {
    try {
      const validated =
        (await formRef.value?.validateField(prop, callback)) ?? false
      if (!validated) {
        return validated
      }
    } catch (e: any) {
      props.validateFail?.(e)
    }
    return true
  }

  /**
   * 滚动到指定的字段
   */
  function scrollToField(prop: FormItemProp) {
    return formRef.value!.scrollToField(prop)
  }

  /**
   * 清理某个字段的表单验证信息
   */
  function clearValidate(props?: Arrayable<FormItemProp> | undefined) {
    return formRef.value!.clearValidate(props)
  }

  /**
   * 获取对应字段实例
   */
  function getFieldInstance(prop: FormItemProp): FormItemInstance | null {
    return formItemRef.get(prop)?.value ?? null
  }

  const result = {
    resolvedColumns,
    resolvedButtons,
    formProps: unref(props.formProps),
    row: unref(props.row),
    formRef,
    submit,
    reset,
    setFieldValue,
    setFieldValues,
    setFieldValuesTransform,
    getFieldValue,
    removeFields,
    validate,
    validateField,
    resetFields,
    scrollToField,
    clearValidate,
    getFieldInstance,
  }

  return result
}
