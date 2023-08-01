import { ref } from 'vue'

import { useScope } from './useScope'

import type {
  BuildProTableResult,
  ProTableInstance,
  ProTableProps,
  ProTableScope,
} from './interface'

export function buildTable<T extends object>(
  options: (scope: ProTableScope<T>, ctx?: undefined) => ProTableProps<T>
): BuildProTableResult<T>
export function buildTable<T extends object, C>(
  options: (scope: ProTableScope<T>, ctx: C) => ProTableProps<T>,
  ctx: C
): BuildProTableResult<T>

export function buildTable<T extends object, C>(
  options: (scope: ProTableScope<T>, ctx?: C) => ProTableProps<T>,
  ctx?: C | undefined
): BuildProTableResult<T> {
  const proTableRef = ref<ProTableInstance<T> | null>(null)

  const scope = useScope(() => proTableRef)

  const {
    columns,
    data,
    tableProps,
    tableSlots,
    pagination,
    loading,
    fetchTableData,
  } = options(scope, ctx)

  const tableBinding: ProTableProps<T> = {
    columns,
    data,
    tableProps,
    tableSlots,
    pagination,
    loading,
    fetchTableData,
  }

  return {
    proTableRef,
    tableBinding,
  }
}
