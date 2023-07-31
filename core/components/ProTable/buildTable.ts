import { ref } from 'vue'

import { ProTableInstanceNames } from './constant'

import type {
  BuildProTableResult,
  ProTableInstance,
  ProTableProps,
  ProTableScope,
} from './interface'

export function buildTable<T extends object, C = undefined>(
  options: (scope: ProTableScope<T>, ctx?: C | undefined) => ProTableProps<T>
): BuildProTableResult<T>
export function buildTable<T extends object, C>(
  options: (scope: ProTableScope<T>, ctx: C) => ProTableProps<T>,
  ctx: C
): BuildProTableResult<T>

export function buildTable<T, C>(
  options: (scope: ProTableScope<T>, ctx?: C) => ProTableProps<T>,
  ctx?: C | undefined
): BuildProTableResult<T> {
  const proTableRef = ref<ProTableInstance<T> | null>(null)

  const scope = ProTableInstanceNames.reduce((prev, curr) => {
    // @ts-ignore
    prev[curr] = (...args) => {
      // @ts-ignore
      return proTableRef.value![curr](...args)
    }
    return prev
  }, {} as ProTableScope<T>)

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
