import { ref } from 'vue'

import { unRef } from '../common'
import { useScope as useFormScope, useValues } from '../ProForm'
import { useScope as useTableScope } from '../ProTable'

import type {
  BuildCrudReturn,
  ProCrudFormProps,
  ProCrudInstance,
  ProCrudProps,
  ProCrudScope,
} from './interface'

export function buildCrud<
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
>(
  options: (scope: ProCrudScope, ctx?: undefined) => ProCrudProps<T, S, F, R>
): BuildCrudReturn<T, S, F, R>

export function buildCrud<
  C extends object,
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
>(
  options: (scope: ProCrudScope, ctx: C) => ProCrudProps<T, S, F, R>,
  context: C
): BuildCrudReturn<T, S, F, R>

export function buildCrud<
  C extends object,
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
>(
  options: (scope: ProCrudScope, ctx?: C) => ProCrudProps<T, S, F, R>,
  ctx?: C
): BuildCrudReturn<T, S, F, R> {
  const proCrudRef = ref<ProCrudInstance | null>(null)

  const scope: ProCrudScope = {
    search: useFormScope(
      () => searchValues,
      () => proCrudRef.value!.proSearchRef!
    ),
    table: useTableScope(() => ref(proCrudRef.value!.proTableRef!)),
  }

  const { columns, table, search, addForm, editForm, viewForm, request } =
    options(scope, ctx)

  const searchValues = useValues(
    search?.initialValues,
    columns?.filter(column => {
      return unRef(column.search?.show)
    }) ?? []
  )

  // const resolvedSearch: ProCrudFormProps = {
  //   ...search,
  //   columns
  // }

  const crudBinding = {
    columns,
    table,
    search,
    addForm,
    editForm,
    viewForm,
    request,
  }

  // @ts-ignore
  return { proCrudRef, crudBinding }
}
