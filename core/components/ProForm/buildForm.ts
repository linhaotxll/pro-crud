import cloneDeep from 'clone-deep'
import { get, set, unset, has, once } from 'lodash-es'
import {
  computed,
  ref,
  toRaw,
  reactive,
  toValue,
  watch,
  toRef,
  unref,
} from 'vue'

import { buildFormColumn } from './buildFormColumn'
import {
  buildDefaultProSearchActionGroup,
  buildDefaultProFormActionGroup,
  DefaultProFormCol,
  DefaultProSearchCol,
} from './constant'
import { useValues } from './useValues'

import { isArray, isFunction } from '../../utils'
import { mergeWithTovalue } from '../common'
import { buildButtonGroup } from '../ProButton'

import type {
  BuildFormOptionResult,
  BuildFormResult,
  InternalProFormColumnOptions,
  ProFormActionGroupExtends,
  ProFormActions,
  ProFormColumnOptions,
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
    getFieldInstance,
  }

  const values = reactive({}) as T

  const {
    initialValues,
    columns,
    formProps,
    name: formName,
    action = {},
    row,
    col,
    fetchDictionaryCollection,
    beforeSubmit,
    submitRequest,
    successRequest,
    failRequest,
    validateFail,
    wrap,
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

  // 构建列
  const resolvedColumns = ref([]) as Ref<InternalProFormColumnOptions<T>[]>
  const resolvedColumnsMap = new Map<
    NamePath,
    InternalProFormColumnOptions<T>
  >()

  // 只调用一次的获取集合函数
  const fetchDictionaryCollectionOnce = isFunction(fetchDictionaryCollection)
    ? once(fetchDictionaryCollection)
    : undefined

  watch(
    [
      toRef(columns) as Ref<ProFormColumnOptions[] | undefined>,
      toRef(formName) as Ref<NamePath | undefined>,
    ],
    ([cols, formName]) => {
      resolvedColumns.value = []

      if (!cols) {
        return
      }

      const tempCols: InternalProFormColumnOptions<DataObject>[] = []

      for (const column of cols) {
        const resolvedColumn = buildFormColumn(
          resolvedCommonColProps,
          isInlineLayout,
          scope,
          column,
          undefined,
          fetchDictionaryCollectionOnce,
          internalColumn => {
            if (internalColumn.name) {
              resolvedColumnsMap.set(internalColumn.name, internalColumn)
            }
          },
          formName
        )
        tempCols.push(resolvedColumn)
      }

      resolvedColumns.value = tempCols
    },
    { immediate: true, deep: true }
  )

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

    const submitRequestValue = unref(submitRequest)
    // 调用接口
    const result = (await submitRequestValue?.(params)) ?? false

    // 成功回调
    if (result) {
      return unref(successRequest)?.(params)
    } else {
      return unref(failRequest)?.()
    }
  }

  /**
   * 提交表单前参数处理
   */
  async function _beforeSubmit(values: T) {
    const params = cloneDeep(toRaw(values))
    const beforeSubmitValue = unref(beforeSubmit)

    // 先进行上传前的处理
    const beforeSubmitParams =
      typeof beforeSubmitValue === 'function'
        ? await beforeSubmitValue(params)
        : (params as unknown as any)

    // 再监测每个字段是否需要上传，不需要会删除
    for (const column of toValue(resolvedColumns)) {
      const { submitted, itemProps } = toValue(column)
      const name = itemProps?.name

      if (name) {
        if (
          submitted === false ||
          (typeof submitted === 'function' && submitted(scope) === false)
        ) {
          unset(beforeSubmitParams, name)
          continue
        }
        set(
          beforeSubmitParams,
          name,
          transformToValue(name, get(beforeSubmitParams, name))
        )
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
    transformFromValue(key, value, values)
  }

  /**
   * 设置表单多个值
   */
  function setFieldValues(values: Record<string, any>) {
    const keys = Object.keys(values)
    for (let i = 0; i < keys.length; ++i) {
      setFieldValue(keys[i], values[keys[i]])
    }
  }

  /**
   * 获取对应字段名的值
   */
  function getFieldValue(name: NamePath) {
    let value = get(values, name)
    const column = resolvedColumnsMap.get(name)
    if (column) {
      const { transform, type, list } = column
      const listValue = toValue(list)

      if (type === 'list' && listValue?.children && isArray(value)) {
        for (let j = 0; j < value.length; ++j) {
          for (let i = 0; i < listValue.children.length; ++i) {
            const { transform, name } = listValue.children[i]
            const resolvedName = isArray(name) ? name[name.length - 1] : name
            if (isFunction(transform?.from)) {
              set(
                value[j],
                resolvedName,
                transform.from(get(value[j], resolvedName))
              )
            }
          }
        }
      }

      if (typeof transform?.from === 'function') {
        value = transform.from(value)
      }
    }
    return value
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
  function validate(name?: NamePath[] | string, options?: ValidateOptions) {
    return Promise.resolve<DataObject | undefined>(
      formRef
        .value!.validate(name, options)
        .then(res => res)
        .catch(e => {
          unref(validateFail)?.(e)
          throw e
        })
    )
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

  /**
   * 转换要设置的 value
   * @param name 表单名称
   * @param value 表单值
   * @param target 结果对象
   */
  function transformFromValue(name: NamePath, value: any, target: any) {
    const column = resolvedColumnsMap.get(name)
    let result: any = value

    if (column) {
      const { transform, type, list } = column
      const listValue = toValue(list)

      if (type === 'list' && listValue?.children && isArray(value)) {
        for (let j = 0; j < value.length; ++j) {
          for (let i = 0; i < listValue.children.length; ++i) {
            const { transform, name } = listValue.children[i]
            const resolvedName = isArray(name) ? name[name.length - 1] : name
            if (isFunction(transform?.from)) {
              result ||= []
              result[j] ||= {}
              set(
                result[j],
                resolvedName,
                transform.from(get(value[j], resolvedName))
              )
            }
          }
        }
      }

      if (typeof transform?.from === 'function') {
        result = transform.from(result)
      }
    }
    set(target, name, result)
  }

  /**
   * 转换要设置的 value
   * @param name 表单名称
   * @param target 结果对象
   */
  function transformToValue(name: NamePath, target: any) {
    const column = resolvedColumnsMap.get(name)
    let result: any = target
    const value = target

    if (column) {
      const { transform, type, list } = column
      const listValue = toValue(list)

      if (type === 'list' && listValue?.children && isArray(value)) {
        for (let j = 0; j < value.length; ++j) {
          for (let i = 0; i < listValue.children.length; ++i) {
            const { transform, name } = listValue.children[i]
            const resolvedName = isArray(name) ? name[name.length - 1] : name
            if (isFunction(transform?.to)) {
              result ||= []
              result[j] ||= {}
              set(
                result[j],
                resolvedName,
                transform.to(get(value[j], resolvedName))
              )
            }
          }
        }
      }

      if (typeof transform?.to === 'function') {
        result = transform.to(result)
      }
    }

    return result
  }

  function getFieldInstance(name: NamePath) {
    return resolvedColumnsMap.get(name)?.instance
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
      wrap,
    },
  }

  return formBinding
}
