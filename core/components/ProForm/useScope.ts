import { get, unset } from 'lodash-es'

import type { ProFormInstance, ProFormScope } from './interface'

export function useScope<T extends object>(
  getValues: () => T,
  getCtx: () => ProFormInstance<T>
) {
  const scope: ProFormScope<T> = {
    getFormValues() {
      return getValues()
    },

    submit() {
      return getCtx().submit()
    },

    reset(prop) {
      return getCtx().reset(prop)
    },

    resetFields(prop) {
      return scope.reset(prop)
    },

    setFieldValue(prop, value) {
      return getCtx().setFieldValue(prop, value)
    },

    setFieldValues(values) {
      return getCtx().setFieldValues(values)
    },

    setFieldValuesTransform(values) {
      return getCtx().setFieldValuesTransform(values)
    },

    getFieldValue(prop) {
      return get(scope.getFormValues(), prop)
    },

    removeFields(prop) {
      return unset(scope.getFormValues(), prop)
    },

    validate(callback) {
      return getCtx().validate(callback)
    },

    validateField(props, callback) {
      return getCtx().validateField(props, callback)
    },

    scrollToField(prop) {
      return getCtx().scrollToField(prop)
    },

    clearValidate(props) {
      return getCtx().clearValidate(props)
    },

    getFieldInstance(prop) {
      return getCtx().getFieldInstance(prop)
    },
  }

  return scope
}
