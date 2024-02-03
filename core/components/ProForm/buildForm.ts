import cloneDeep from 'clone-deep'
import { get, has, merge, set, unset } from 'lodash-es'
import { computed, inject, ref, toRaw, toValue } from 'vue'

import { buildFormColumn } from './buildFormColumn'
import { DefaultProFormCol } from './constant'
import { useValues } from './useValues'

import { GlobalOption } from '../../constant'
import { processDictionary, unRef } from '../common'
import { showToast } from '../Toast'

import type {
  BuildFormBinding,
  BuildFormOptionResult,
  BuildFormResult,
  InternalProFormColumnOptions,
  ProFormActionsOptions,
  ProFormInstance,
  ProFormScope,
} from './interface'
import type { Arrayable } from '../common'
import type {
  FormItemProps,
  FormInstance,
  FormItemInstance,
  FormProps,
  ColProps,
} from 'ant-design-vue'
import type {
  NamePath,
  ValidateOptions,
} from 'ant-design-vue/es/form/interface'
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
    validateFields,
    scrollToField,
    clearValidate,
    getFieldInstance,
  }

  const {
    initialValues,
    columns = [],
    formProps,
    labelCol,
    wrapperCol,
    actions,
    toast,
    row,
    col = DefaultProFormCol,
    fetchDictCollection,
    beforeSubmit,
    submitRequest,
    successRequest,
    validateFail,
  } = options(scope, ctx)

  const values = useValues(initialValues, columns)

  // el-form ref
  const formRef = ref<FormInstance | null>(null)

  // 解析列配置
  const resolvedLabelCol = computed(() => unRef(labelCol))
  const resolvedWrapperCol = computed(() => unRef(wrapperCol))

  const resolvedColumnsMap = new Map<
    FormItemProps['name'],
    InternalProFormColumnOptions<T>
  >()

  // 解析字典集合
  const resolveColumnDictionary = processDictionary(fetchDictCollection)

  // 解析列配置
  const resolvedColumns = columns.map(c => {
    // const dict = resolveColumnDictionary(c)
    return computed(() =>
      buildFormColumn(col, resolvedColumnsMap, c, resolveColumnDictionary)
    )
  })

  // 解析表单配置
  const resolvedFormProps = computed<FormProps>(() => {
    const result: FormProps = {}

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
  const defaultActions: ProFormActionsOptions = {
    show: true,
    list: {
      confirm: {
        show: true,
        text: '提交',
        props: { type: 'primary', onClick: scope.submit },
      },
    },
  }

  // 解析按钮组配置
  const resolvedActions = computed(() => {
    const { col, show, ...rest } = merge({}, defaultActions, actions)

    const formLabelSpan = resolvedFormProps.value.labelCol?.span ?? 0
    const mergeCol: ColProps = merge({ offset: formLabelSpan }, toValue(col))

    const result: ProFormActionsOptions = merge(
      {
        show: toValue(show),
        col: mergeCol,
      },
      rest
    )

    return result
  })

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
    const params = await _beforeSubmit(values)

    // 调用接口
    const result = (await submitRequest?.(params)) ?? false

    // 提示
    if (result) {
      successRequest?.()
      showToast(toast)
    }
  }

  /**
   * 提交表单前参数处理
   */
  async function _beforeSubmit(values: T) {
    const params = cloneDeep(toRaw(values))

    // 先进行上传前的处理
    const beforeSubmitParams =
      typeof beforeSubmit === 'function'
        ? await beforeSubmit(params)
        : (params as unknown as any)

    // 再监测每个字段是否需要上传，不需要会删除
    for (const column of resolvedColumns) {
      const { submitted, itemProps, transform } = column.value
      const name = unRef(itemProps!.name)

      if (name) {
        // 检测字段是否需要提交上传
        if (
          submitted === false ||
          (typeof submitted === 'function' && submitted(scope) === false)
        ) {
          unset(beforeSubmitParams, name)
          continue
        }

        // 表单数据转换为服务端数据
        if (typeof transform?.to === 'function') {
          set(
            beforeSubmitParams,
            name,
            transform.to(get(beforeSubmitParams, name))
          )
        }
      }
    }

    // 返回上传前处理好的参数
    return beforeSubmitParams
  }

  /**
   * 重置表单
   */
  function reset(name?: NamePath) {
    formRef.value?.resetFields(name)

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
  function resetFields(name?: NamePath) {
    return reset(name)
  }

  /**
   * 设置表单
   */
  function setFieldValue(key: NamePath, value: any, transformed = false) {
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
  function getFieldValue(name: NamePath) {
    return get(values, name)
  }

  /**
   * 删除对应字段
   */
  function removeFields(name: NamePath) {
    return unset(values, name)
  }

  /**
   * 对整个表单的内容进行验证
   */
  async function validate(
    name?: Arrayable<NamePath> | undefined,
    options?: ValidateOptions
  ) {
    let validated: T | undefined
    try {
      // @ts-ignore
      validated = await formRef.value!.validate(name, options)
    } catch (e: any) {
      validateFail?.(e)
    }
    return validated
  }

  /**
   * 验证具体的某个字段
   */
  async function validateFields(
    name?: Arrayable<NamePath> | undefined,
    options?: ValidateOptions
  ) {
    return validate(name, options)
  }

  /**
   * 滚动到指定的字段
   */
  function scrollToField(name: NamePath, options?: any) {
    return formRef.value!.scrollToField(name, options)
  }

  /**
   * 清理某个字段的表单验证信息
   */
  function clearValidate(name?: NamePath) {
    return formRef.value!.clearValidate(name)
  }

  /**
   * 获取对应字段实例
   */
  function getFieldInstance(name: NamePath): FormItemInstance | null {
    return formItemRef.get(name)?.value ?? null
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
      labelCol: resolvedLabelCol,
      wrapperCol: resolvedWrapperCol,
      formProps: resolvedFormProps,
      actions: resolvedActions,
      values,
      scope,
      formRef,
      formItemRef,
      resolvedColumnsMap,
      row: computed(() => unRef(row)),
    },
  }

  inject(GlobalOption)?.hooks?.form?.({
    proFormScope: scope,
    proFormBinding: formBinding.proFormBinding,
    proFormRef,
  })

  return formBinding
}
