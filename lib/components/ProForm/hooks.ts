import { ElMessage, type FormInstance } from 'element-plus'
import { get, has, set, unset } from 'lodash-es'
import { computed, provide, ref, unref } from 'vue'

import {
  DefaultFormFieldType,
  DefaultPreserve,
  FormItemRefKey,
  ShowButton,
} from './constant'

import type {
  ButtonsOption,
  InternalProFormColumnOptions,
  ProFormOptions,
  ValueType,
} from './interface'
import type {
  FormItemInstance,
  FormItemProp,
  FormValidateCallback,
  FormValidationResult,
} from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils'
import type { Ref } from 'vue'

export function useForm<T extends object, R = T>(
  props: ProFormOptions<T, R>,
  values: T
) {
  // el-form ref
  const formRef = ref<FormInstance | null>(null)

  // 通用 el-col 配置
  const formCol = unref(props.col)

  const formItemRef = new Map<FormItemProp, Ref<FormItemInstance>>()

  const resolvedColumns = props.columns.map(column => {
    return computed(() => {
      console.log(column.prop, '-> changed')
      // 默认 type 类型
      const defaultType: ValueType = unref(column.type ?? DefaultFormFieldType)

      // 最终给表单传递的 props 集合：type 对应的 props + 用户传入的 props
      const resolvedProps: object | undefined = {
        ...valueTypeMap[defaultType][1],
        ...column.fieldProps,
      }

      const result: InternalProFormColumnOptions = {
        ...column,
        label: undefined,
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

      return result
    })
  })

  // 解析按钮组配置
  const resolvedButtons = computed(() => {
    const buttons = props.buttons

    const result: ButtonsOption = buttons
      ? {
          show: unref(buttons.show),
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
    const params: R =
      typeof props.beforeSubmit === 'function'
        ? await props.beforeSubmit(values)
        : (values as unknown as R)

    // 调用接口
    const result = (await props.submitRequest?.(params)) ?? false

    // 提示
    if (result) {
      ElMessage.success('提交成功')
    }
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
  function setFieldValue(key: FormItemProp, value: any) {
    set(values, key, value)
  }

  /**
   * 设置表单多个值
   */
  function setFieldValues(values: Record<string, any>) {
    Object.keys(values).forEach(key => {
      setFieldValue(key, values[key])
    })
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

  return {
    resolvedColumns,
    resolvedButtons,
    formProps: unref(props.formProps),
    row: unref(props.row),
    formRef,
    submit,
    reset,
    setFieldValue,
    setFieldValues,
    getFieldValue,
    removeFields,
    validate,
    validateField,
    resetFields,
    scrollToField,
    clearValidate,
    getFieldInstance,
  }
}
