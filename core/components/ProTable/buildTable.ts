import { ref } from 'vue'

import type {
  BuildProTableResult,
  ProTableBinding,
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
  const proTableRef = ref<ProTableInstance | null>(null)

  const scope: ProTableScope<T> = {}

  const { columns, data, tableProps, tableSlots } = options(scope, ctx)

  const tableBinding: ProTableBinding<T> = {
    columns,
    data,
    tableProps,
    tableSlots,
  }

  return {
    proTableRef,
    tableBinding,
  }
}
