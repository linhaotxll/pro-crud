import { provide, ref } from 'vue'

import { ProFormScopeKey, ProFormValueKey } from './constant'
import { useScope } from './useScope'
import { useValues } from './useValues'

import type { ProFormInstance, ProFormOptions, ProFormScope } from './interface'
import type { Ref } from 'vue'

export interface UseFormReturn<T extends object, R = T> {
  proFormRef: Ref<ProFormInstance<T> | null>
  formBinding: ProFormOptions<T, R>
}

export function buildForm<T extends object, C = undefined, R = T>(
  options: (scope: ProFormScope<T>, ctx?: C | undefined) => ProFormOptions<T, R>
): UseFormReturn<T, R>
export function buildForm<T extends object, C, R = T>(
  options: (scope: ProFormScope<T>, ctx: C) => ProFormOptions<T, R>,
  context: C
): UseFormReturn<T, R>

export function buildForm<T extends object, C, R = T>(
  options: (scope: ProFormScope<T>, ctx?: C) => ProFormOptions<T, R>,
  ctx?: C
): UseFormReturn<T, R> {
  const proFormRef = ref<ProFormInstance<T> | null>(null)

  const scope = useScope(() => proFormRef.value!)

  const {
    initialValues,
    columns,
    formProps,
    row,
    col,
    buttons,
    toast,
    validateFail,
    submitRequest,
  } = options(scope, ctx)

  const values = useValues(initialValues, columns)

  const formBinding: ProFormOptions<T, R> = {
    columns,
    row,
    col,
    formProps,
    initialValues,
    buttons,
    toast,
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
