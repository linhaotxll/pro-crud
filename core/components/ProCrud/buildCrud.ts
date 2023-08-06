import { merge } from 'lodash-es'
import { computed, provide, ref } from 'vue'

import { ProSearchRef, ProTableRef } from './constant'

import { unRef } from '../common'
import { buildSearch } from '../ProSearch'
import { buildTable } from '../ProTable'

import type {
  BuildCrudBinding,
  BuildCrudOptionReturn,
  BuildCrudReturn,
  ProCrudColumnOption,
  ProCrudInstance,
  ProCrudScope,
} from './interface'
import type { ButtonsOption, ProFormColumnOptions } from '../ProForm'
import type { ProSearchScope } from '../ProSearch'
import type {
  FetchTableDataResult,
  FetchTableListQuery,
  ProTableColumnProps,
  ProTableScope,
} from '../ProTable'

export function buildCrud<
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
>(
  options: (
    scope: ProCrudScope,
    ctx?: undefined
  ) => BuildCrudOptionReturn<T, S, F, R>
): BuildCrudReturn<T, S, F, R>

export function buildCrud<
  C extends object,
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
>(
  options: (scope: ProCrudScope, ctx: C) => BuildCrudOptionReturn<T, S, F, R>,
  context: C
): BuildCrudReturn<T, S, F, R>

export function buildCrud<
  C extends object,
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
>(
  options: (scope: ProCrudScope, ctx?: C) => BuildCrudOptionReturn<T, S, F, R>,
  ctx?: C
): BuildCrudReturn<T, S, F, R> {
  const proCrudRef = ref<ProCrudInstance | null>(null)

  const scope: ProCrudScope = {
    // search: useFormScope(
    //   () => searchValues,
    //   () => proCrudRef.value!.proSearchRef!
    // ),
    // table: useTableScope(() => ref(proCrudRef.value!.proTableRef!)),
  }

  const {
    columns,
    table,
    search,
    autoReload = true,
    request = {},
  } = options(scope, ctx)

  const initialColumns: [
    ProCrudColumnOption<any>[],
    ProCrudColumnOption<any>[],
    ProCrudColumnOption<any>[],
    ProCrudColumnOption<any>[],
    ProCrudColumnOption<any>[]
  ] = [[], [], [], [], []]

  const [searchColumns, tableColumns] =
    columns?.reduce((prev, curr) => {
      if (!(curr.search?.show === false)) {
        prev[0].push(curr)
      }
      if (!(curr.table?.show === false)) {
        prev[1].push(curr)
      }

      return prev
    }, initialColumns) ?? initialColumns

  const searchShow = computed(() => unRef(search?.show ?? true))

  const buildCtx: {
    searchScope?: ProSearchScope<any>
    tableScope?: ProTableScope<any>
  } = {}

  const { proSearchBinding, proSearchRef } = buildSearch<F, typeof buildCtx, R>(
    searchScope => {
      buildCtx.searchScope = searchScope

      const { show: _, buttons: customButtons, ...rest } = search || {}

      const buttons = merge<ButtonsOption, ButtonsOption | undefined>(
        {
          list: {
            confirm: {
              props: {
                onClick() {
                  buildCtx.tableScope?.reload()
                },
              },
            },

            reset: {
              props: {
                onClick() {
                  buildCtx.searchScope?.reset()
                  if (autoReload) {
                    buildCtx.tableScope?.reload()
                  }
                },
              },
            },
          },
        },
        customButtons
      )

      return {
        columns: searchColumns.map<ProFormColumnOptions<any>>(column => ({
          label: column.label,
          prop: column.prop,
          ...column.search,
        })),
        buttons,
        ...rest,
      }
    },
    buildCtx
  )

  const { proTableBinding, proTableRef } = buildTable(tableScope => {
    buildCtx.tableScope = tableScope

    const { show: _, ...rest } = table || {}
    return {
      ...rest,
      columns: tableColumns.map<ProTableColumnProps<any>>(column => ({
        label: column.label,
        prop: column.prop,
        ...column.table,
      })),
      request: {
        fetchTableData,
      },
    }
  }, buildCtx)

  provide(ProSearchRef, proSearchRef)
  provide(ProTableRef, proTableRef)

  /**
   * 获取数据
   */
  async function fetchTableData(
    query: FetchTableListQuery
  ): Promise<FetchTableDataResult<T>> {
    const form = proSearchRef.value!.getFormValues()
    const params = { query, form }
    const transformInput = request.transformQuery?.(params) ?? (params as R)

    const response = (await request.fetchPaginationData?.(transformInput)) as S

    const transformOutput =
      request.transformResponse?.({
        query: transformInput,
        response,
      }) ?? (response as FetchTableDataResult<T>)

    return {
      data: transformOutput.data,
      total: transformOutput.total,
    }
  }

  const tableShow = computed(() => unRef(table?.show ?? true))

  const proCrudBinding: BuildCrudBinding<T, S, F, R> = {
    searchShow,
    proSearchBinding,

    tableShow,
    proTableBinding,
  }

  // @ts-ignore
  return { proCrudRef, proCrudBinding }
}
