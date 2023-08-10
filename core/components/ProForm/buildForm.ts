import cloneDeep from 'clone-deep'
import {
  ElMessage,
  ElNotification,
  type FormItemProp,
  type MessageParams,
  type NotificationParams,
} from 'element-plus'
import { get, has, merge, set, unset } from 'lodash-es'
import { computed, ref, toRaw } from 'vue'

import {
  DefaultCol,
  DefaultFormFieldType,
  DefaultPreserve,
  DefaultRow,
  ShowButton,
} from './constant'
import { useValues } from './useValues'

import { unRef, valueTypeMap } from '../common'

import type {
  BuildFormBinding,
  BuildFormOptionResult,
  BuildFormResult,
  ButtonsOption,
  InternalProFormColumnOptions,
  ProFormInstance,
  ProFormScope,
  SuccessToastType,
} from './interface'
import type { Arrayable, ElFormProps, ValueType } from '../common'
import type {
  FormInstance,
  FormItemInstance,
  FormValidateCallback,
  FormValidationResult,
} from 'element-plus'
import type { Ref } from 'vue'

export function buildForm<T extends object, C = undefined, R = T>(
  options: (
    scope: ProFormScope<T>,
    ctx?: C | undefined
  ) => BuildFormOptionResult<T, R>
): BuildFormResult<T>
export function buildForm<T extends object, C, R = T>(
  options: (scope: ProFormScope<T>, ctx: C) => BuildFormOptionResult<T, R>,
  context: C
): BuildFormResult<T>

export function buildForm<T extends object, C, R = T>(
  options: (scope: ProFormScope<T>, ctx?: C) => BuildFormOptionResult<T, R>,
  ctx?: C
): BuildFormResult<T> {
  const scope: ProFormScope<T> = {
    getFormValues,
    submit,
    reset,
    resetFields,
    setFieldValue,
    setFieldValues,
    setFieldValuesTransform,
    getFieldValue,
    removeFields,
    validate,
    validateField,
    scrollToField,
    clearValidate,
    getFieldInstance,
  }

  const {
    initialValues,
    columns = [],
    formProps,
    row = DefaultRow,
    col = DefaultCol,
    buttons,
    toast,
    preserve = DefaultPreserve,
    request = {},
  } = options(scope, ctx)

  const values = useValues(initialValues, columns)

  // el-form ref
  const formRef = ref<FormInstance | null>(null)

  // 解析列配置
  const resolvedCol = computed(() => unRef(col))

  const resolvedColumnsMap = new Map<
    FormItemProp,
    InternalProFormColumnOptions<T>
  >()

  // 解析列配置
  const resolvedColumns = columns.map(column => {
    return computed(() => {
      // 默认 type 类型
      const defaultType: ValueType = unRef(column.type ?? DefaultFormFieldType)

      // 最终给表单传递的 props 集合：type 对应的 props + 用户传入的 props
      const resolvedProps: object | undefined = {
        ...valueTypeMap[defaultType][1],
        ...column.fieldProps,
      }

      const prop = unRef(column.prop)

      const result: InternalProFormColumnOptions<T> = {
        ...column,
        label: undefined,
        submitted: column.submitted ?? true,
        preserve:
          (column.preserve != null ? column.preserve : preserve) ??
          DefaultPreserve,
        resolvedKey: typeof prop === 'string' ? prop : prop.join('.'),
        itemProps: {
          label: unRef(column.label),
          prop,
          ...column.itemProps,
        },
        tooltip: column.tooltip
          ? typeof column.tooltip === 'string'
            ? { content: column.tooltip }
            : column.tooltip
          : undefined,
        col: {
          ...resolvedCol.value,
          ...unRef(column.col),
        },
        type: defaultType,
        resolvedProps,
        show: unRef(column.show ?? true),
      }

      delete result.label

      resolvedColumnsMap.set(prop, result)

      return result
    })
  })

  // 解析表单配置
  const resolvedFormProps = computed<ElFormProps>(() => {
    const result: ElFormProps = {}

    const originFormProps = unRef(formProps)

    if (originFormProps) {
      Object.keys(originFormProps).forEach(key => {
        // @ts-ignore
        result[key] = unRef(originFormProps[key])
      })
    }

    return result
  })

  // 默认按钮
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
    const mergeButtons = merge({}, defaultButtons, buttons)

    const result: ButtonsOption = {
      show: unRef(mergeButtons.show),
      col: unRef(mergeButtons.col),
      list: Object.keys(mergeButtons.list ?? {}).reduce<ButtonsOption['list']>(
        (prev, curr) => {
          prev![curr] = {
            ...mergeButtons.list![curr],
            show: unRef(mergeButtons.list![curr]?.show ?? ShowButton),
          }
          return prev
        },
        {}
      ),
    }

    return result
  })

  // 解析提示配置
  const resolvedToast = computed(() => {
    const mergeToast = unRef(toast ?? { type: 'message' as SuccessToastType })
    if (mergeToast === false) {
      return null
    }

    let type: SuccessToastType = 'message'
    let toastProps: MessageParams | NotificationParams = {
      type: 'success',
      message: '提交成功',
    }

    type = mergeToast.type
    toastProps = merge(toastProps, mergeToast.props)

    return () =>
      type === 'message'
        ? ElMessage(toastProps as MessageParams)
        : ElNotification(toastProps as NotificationParams)
  })

  // 解析行配置
  const resolvedRow = computed(() => unRef(row))

  const formItemRef: BuildFormBinding<T>['formItemRef'] = new Map()

  /**
   * 提交表单
   * @returns
   */
  async function submit() {
    // 验证
    const validated = await validate()
    if (!validated) {
      return
    }

    // 数据转换
    const params = await beforeSubmit(values)

    // 调用接口
    const result = (await request.submitRequest?.(params)) ?? false

    // 提示
    const showToast = resolvedToast.value
    if (showToast !== null) {
      if (result) {
        showToast()
        request.successRequest?.()
      }
    }
  }

  /**
   * 提交表单前参数处理
   */
  async function beforeSubmit(values: T) {
    const params = cloneDeep(toRaw(values))

    for (const column of resolvedColumns) {
      const { submitted, itemProps, transform } = column.value
      const prop = itemProps!.prop as FormItemProp

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
    return (typeof request.beforeSubmit === 'function'
      ? await request.beforeSubmit(params)
      : params) as unknown as R
  }

  /**
   * 重置表单
   */
  function reset(prop?: Arrayable<FormItemProp>) {
    formRef.value?.resetFields(prop)

    // 删除多余属性，重置已有属性，确保必须是 initialValue
    Object.keys(values).forEach(key => {
      if (!has(initialValues, key)) {
        removeFields(key)
      } else {
        setFieldValue(key, (initialValues as any)?.[key], true)
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
      request.validateFail?.(e)
      return false
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
      request.validateFail?.(e)
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

  /**
   * 获取表单值
   */
  function getFormValues() {
    return values
  }

  const proFormRef = ref(null) as Ref<ProFormInstance<T> | null>
  const formBinding: BuildFormResult<T> = {
    proFormRef,
    proFormBinding: {
      columns: resolvedColumns,
      row: resolvedRow,
      col: resolvedCol,
      formProps: resolvedFormProps,
      buttons: resolvedButtons,
      toast: resolvedToast,
      values,
      scope,
      formRef,
      formItemRef,
    },
  }

  return formBinding
}
