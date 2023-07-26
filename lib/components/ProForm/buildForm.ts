import { cloneDeep, merge } from 'lodash-es'
import { provide, reactive, ref } from 'vue'

import { ProFormScopeKey, ProFormValueKey } from './constant'

import type { ProFormInstance, ProFormOptions, ProFormScope } from './interface'
import type { Ref } from 'vue'

export interface UseFormReturn<T extends object, R = T> {
  proFormRef: Ref<ProFormInstance | null>
  formBinding: ProFormOptions<T, R>
}

export function buildForm<T extends object, C = undefined, R = T>(
  options: (scope: ProFormScope<T>) => ProFormOptions<T, R>
): UseFormReturn<T, R>
export function buildForm<T extends object, C, R = T>(
  options: (scope: ProFormScope<T>, ctx: C) => ProFormOptions<T, R>,
  context: C
): UseFormReturn<T, R>

export function buildForm<T extends object, C, R = T>(
  options: (scope: ProFormScope<T>, ctx?: C) => ProFormOptions<T, R>,
  ctx?: C
): UseFormReturn<T, R> {
  const proFormRef = ref<ProFormInstance | null>(null)

  const scope: ProFormScope<T> = {
    getFormValues() {
      return values
    },

    submit() {
      return proFormRef.value!.submit()
    },

    reset(prop) {
      return proFormRef.value!.reset(prop)
    },

    resetFields(prop) {
      return scope.reset(prop)
    },

    setFieldValue(prop, value) {
      return proFormRef.value!.setFieldValue(prop, value)
    },

    setFieldValues(values) {
      return proFormRef.value!.setFieldValues(values)
    },

    getFieldValue(prop) {
      return proFormRef.value!.getFieldValue(prop)
    },

    removeFields(prop) {
      return proFormRef.value!.removeFields(prop)
    },

    validate(callback) {
      return proFormRef.value!.validate(callback)
    },

    validateField(props, callback) {
      return proFormRef.value!.validateField(props, callback)
    },

    scrollToField(prop) {
      return proFormRef.value!.scrollToField(prop)
    },

    clearValidate(props) {
      return proFormRef.value!.clearValidate(props)
    },

    getFieldInstance(prop) {
      return proFormRef.value!.getFieldInstance(prop)
    },
  }

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

  const {
    initialValues,
    columns,
    formProps,
    row = { gutter: 16 },
    col = { span: 12 },
    buttons,
    validateFail,
    submitRequest,
  } = options(scope, ctx)

  const values = reactive<T>((cloneDeep(initialValues) as T) ?? ({} as T)) as T

  const formBinding: ProFormOptions<T, R> = {
    columns,
    row,
    col,
    formProps,
    initialValues,
    buttons: merge(defaultButtons, buttons),
    validateFail,
    submitRequest,
  }

  provide(ProFormValueKey, values)
  provide(ProFormScopeKey, scope)

  return {
    proFormRef,
    formBinding,
  }
}
