import cloneDeep from 'clone-deep'
import { get, set, unset, has, once } from 'lodash-es'
import {
  computed,
  inject,
  ref,
  toRaw,
  reactive,
  watchEffect,
  toValue,
} from 'vue'

import { buildFormColumn } from './buildFormColumn'
import {
  buildDefaultProSearchActionGroup,
  buildDefaultProFormActionGroup,
  DefaultProFormCol,
  DefaultProFormToast,
  DefaultProSearchCol,
} from './constant'
import { useValues } from './useValues'

import { GlobalOption } from '../../constant'
import { isFunction } from '../../utils'
import { mergeWithTovalue } from '../common'
import { buildButtonGroup } from '../ProButton'
import { showToast } from '../Toast'

import type {
  BuildFormOptionResult,
  BuildFormResult,
  InternalProFormColumnOptions,
  ProFormActionGroupExtends,
  ProFormActions,
  ProFormScope,
} from './interface'
import type { DataObject, NamePath } from '../common'
import type {
  FormProps,
  ColProps,
  FormInstance,
  RowProps,
} from 'ant-design-vue'
import type { ValidateOptions } from 'ant-design-vue/es/form/interface'
import type { Ref } from 'vue'

export function buildForm<
  T extends DataObject = DataObject,
  S extends DataObject = T
>(
  options: (scope: ProFormScope<T>) => BuildFormOptionResult<T, S>
): BuildFormResult<T> {
  const scope: ProFormScope<T> = {
    getFormValues,
    submit,
    reset,
    setFieldValue,
    setFieldValues,
    getFieldValue,
    removeFields,
    validate,
    scrollToField,
    clearValidate,
  }

  const values = reactive({}) as T

  const {
    initialValues,
    columns,
    formProps,
    labelCol,
    wrapperCol,
    action = {},
    toast = DefaultProFormToast,
    row,
    col,
    fetchDictionaryCollection,
    beforeSubmit,
    submitRequest,
    successRequest,
    validateFail,
  } = options(scope)

  // 修改 values
  useValues(values, initialValues)

  // 解析 Form Props
  const resolvedFormProps = formProps
    ? computed<FormProps>(() => mergeWithTovalue({}, toValue(formProps)))
    : undefined

  // 是否是行内模式
  const isInlineLayout = computed(
    () => resolvedFormProps?.value.layout === 'inline'
  )

  // 解析通用 Row Props
  const resolvedCommonRowProps = row
    ? computed<RowProps>(() => mergeWithTovalue({}, toValue(row)))
    : undefined

  // 解析通用 Col Props
  // 行内模式使用 ProSearch，否则使用正常模式，其中不使用默认值需要指定 null
  const resolvedCommonColProps = computed<ColProps | undefined>(() => {
    if (toValue(isInlineLayout)) {
      return mergeWithTovalue({}, DefaultProSearchCol, toValue(col))
    }
    return col === null
      ? undefined
      : mergeWithTovalue({}, DefaultProFormCol, toValue(col))
  })

  // 解析通用 Label Col Props
  const resolvedCommonLabelColProps = labelCol
    ? computed<ColProps>(() => mergeWithTovalue({}, toValue(labelCol)))
    : undefined

  // 解析通用 Wrapper Col Props
  const resolvedCommonWrapperColProps = wrapperCol
    ? computed<ColProps>(() => mergeWithTovalue({}, toValue(wrapperCol)))
    : undefined

  // 构建列
  const resolvedColumns = ref([]) as Ref<Ref<InternalProFormColumnOptions<T>>[]>
  const resolvedColumnsMap = new Map<
    NamePath,
    InternalProFormColumnOptions<T>
  >()

  // 只调用一次的获取集合函数
  const fetchDictionaryCollectionOnce = isFunction(fetchDictionaryCollection)
    ? once(fetchDictionaryCollection)
    : undefined

  watchEffect(() => {
    resolvedColumns.value = []
    const columnsValue = toValue(columns)
    if (!columnsValue) {
      return
    }
    for (const column of columnsValue) {
      const resolvedColumn = buildFormColumn(
        resolvedCommonColProps,
        resolvedCommonLabelColProps,
        resolvedCommonWrapperColProps,
        isInlineLayout,
        scope,
        column,
        undefined,
        fetchDictionaryCollectionOnce,
        internalColumn => {
          if (internalColumn.name) {
            resolvedColumnsMap.set(internalColumn.name, internalColumn)
          }
        }
      )
      resolvedColumns.value.push(resolvedColumn)
    }
  })

  // 构建按扭组
  const actionGroup = buildButtonGroup<
    ProFormActions,
    ProFormActionGroupExtends
  >(
    computed(() => {
      const args: any[] = []
      if (toValue(isInlineLayout)) {
        args.push(
          buildDefaultProSearchActionGroup(
            scope,
            toValue(resolvedCommonColProps),
            toValue(resolvedColumns),
            toValue(action)
          )
        )
      } else {
        args.push(buildDefaultProFormActionGroup(scope), toValue(action))
      }
      return mergeWithTovalue({}, ...args)
    })
  )

  // Form Ref
  const formRef = ref<FormInstance | null>(null)

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

    // 成功回调
    if (result) {
      successRequest?.(params)
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
    for (const column of toValue(resolvedColumns)) {
      const { submitted, itemProps, transform } = column.value
      const name = itemProps?.name

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
  function reset(name?: NamePath[]) {
    formRef.value?.resetFields(name as any)

    // 删除多余属性，重置已有属性，确保必须是 initialValue
    function _reset(fileds: NamePath[]) {
      for (const field of fileds) {
        if (!has(initialValues, field)) {
          removeFields(field)
        } else {
          setFieldValue(field, get(initialValues, field))
        }
      }
    }

    if (!name) {
      _reset(Object.keys(values))
    } else {
      _reset(name)
    }
  }

  /**
   * 设置一个表单值
   */
  function setFieldValue(key: NamePath, value: any) {
    const column = resolvedColumnsMap.get(key)
    if (column) {
      if (typeof column.transform?.from === 'function') {
        value = column.transform.from(value)
      }
    }
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
    name?: NamePath[] | string,
    options?: ValidateOptions
  ) {
    let validated: T | undefined
    try {
      validated = (await formRef.value?.validate(name, options)) as T
    } catch (e: any) {
      validateFail?.(e)
    }
    return validated
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
  function clearValidate(name?: NamePath[]) {
    return formRef.value!.clearValidate(name as any)
  }

  /**
   * 获取表单值
   */
  function getFormValues() {
    return values
  }

  const formBinding: BuildFormResult<T> = {
    proFormBinding: {
      row: resolvedCommonRowProps,
      columns: resolvedColumns,
      formProps: resolvedFormProps,
      actionGroup,
      values,
      scope,
      formRef,
      isInlineLayout,
    },
  }

  inject(GlobalOption)?.hooks?.form?.({
    proFormScope: scope,
    proFormBinding: formBinding.proFormBinding,
  })

  return formBinding
}
