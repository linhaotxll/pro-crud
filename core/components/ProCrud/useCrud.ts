import { merge } from 'lodash-es'

import { callPageList } from './useFetch'

import { unRef } from '../common'
import { buildSearch } from '../ProSearch'
import { buildTable } from '../ProTable'

import type { ProCrudColumnOption, ProCrudProps } from './interface'
import type { ProFormColumnOptions } from '../ProForm'
import type { ProSearchScope } from '../ProSearch'
import type { ProTableColumnProps } from '../ProTable'

export function useCrud<
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
>(props: ProCrudProps<T, S, F, R>) {
  const resolvedColumns: [
    ProCrudColumnOption<any>[],
    ProCrudColumnOption<any>[],
    ProCrudColumnOption<any>[],
    ProCrudColumnOption<any>[],
    ProCrudColumnOption<any>[]
  ] = [[], [], [], [], []]

  if (props.columns) {
    for (let i = props.columns.length - 1; i >= 0; i--) {
      const curr = props.columns[i]

      const searchShow = unRef(curr.search?.show)
      if (searchShow) {
        resolvedColumns[1].unshift(curr)
      }

      resolvedColumns[0].unshift(curr)

      resolvedColumns[2].unshift(curr)
      resolvedColumns[3].unshift(curr)
      resolvedColumns[4].unshift(curr)
    }
  }

  const ctx: { proSeachScope: ProSearchScope<any> | null } = {
    proSeachScope: null,
  }

  const { searchBinding, proSearchRef } = buildSearch(scope => {
    ctx.proSeachScope = scope
    const columns = resolvedColumns[1].map<ProFormColumnOptions<any>>(
      column => {
        return {
          ...column.search,
          label: column.label,
          prop: column.prop,
        }
      }
    )

    // 合并按钮组
    const buttons = merge(
      {
        list: {
          confirm: {
            props: {
              onClick() {
                proTableRef.value?.reload()
              },
            },
          },
        },
      },
      props.search?.buttons
    )

    return {
      ...props.search,
      columns,
      buttons,
    }
  })

  const { proTableRef, tableBinding } = buildTable((_, ctx) => {
    const columns = resolvedColumns[0].map<ProTableColumnProps<any>>(column => {
      return {
        ...column.column,
        label: column.label,
        prop: column.prop,
      }
    })

    return {
      ...props.table,
      columns,
      fetchTableData: query =>
        callPageList(props.request, ctx.proSeachScope?.getFormValues())(query),
    }
  }, ctx)

  return {
    searchBinding,
    proSearchRef,
    proTableRef,
    tableBinding,
  }
}
