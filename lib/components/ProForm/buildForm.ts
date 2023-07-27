import { cloneDeep } from 'lodash-es'
import { provide, reactive, ref } from 'vue'

import { ProFormScopeKey, ProFormValueKey } from './constant'
import { useScope } from './useScope'

import type { ProFormInstance, ProFormOptions, ProFormScope } from './interface'
import type { Ref } from 'vue'

export interface UseFormReturn<T extends object, R = T> {
  proFormRef: Ref<ProFormInstance | null>
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
  const proFormRef = ref<ProFormInstance | null>(null)

  const { scope } = useScope(
    () => values,
    () => proFormRef.value!
  )

  const {
    initialValues,
    columns,
    formProps,
    row,
    col,
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
    buttons,
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
