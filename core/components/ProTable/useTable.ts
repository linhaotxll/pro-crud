import { merge } from 'lodash-es'
import { computed, unref, ref, isRef, watch } from 'vue'

import {
  tableColumnPropsNames,
  tablePropsNameMap,
  tablePropsNames,
} from './constant'

import type {
  ElTableColumnProps,
  ElTableProps,
  ProTableColumnProps,
  ProTableProps,
  ResolvedProTableProps,
  UseTableReturn,
} from './interface'
import type { MaybeRef } from '../common/interface'
import type { TableProps } from 'element-plus'
import type { Ref } from 'vue'

const defaultTableProps: ResolvedProTableProps<unknown> = {
  initialPageNumber: 1,
  pageSize: 10,
}

export function toRef<T>(value: MaybeRef<T>): T {
  return isRef(value) ? value.value : value
}

export function useTable<T>(props: ProTableProps<T>) {
  const resolvedProps: ResolvedProTableProps<T> = merge(
    {},
    defaultTableProps,
    props
  )

  const { tableProps: originTableProps = {} } = resolvedProps

  // const height = toRef(originTableProps.height)

  const { pageNumber, pageSize, total, data, loading, next, previous } =
    useFetchTableData(
      resolvedProps.initialPageNumber,
      resolvedProps.pageSize,
      resolvedProps.data,
      resolvedProps.fetchTableData
    )

  const resolvedPagination = computed(() => {
    const pagination = unref(resolvedProps.pagination)
    if (pagination === false) {
      return false
    }

    return {
      pageSize: pageSize.value,
      currentPage: pageNumber.value,
      'onUpdate:currentPage': (pageN: number) => {
        //
      },
      total: total.value,
      ...pagination,
    }
  })

  const resolvedColumns =
    props.columns?.map(column => {
      return computed(() => {
        const result: ElTableColumnProps<T> = {
          label: toRef(column.label),
          prop: toRef(column.prop),
        }

        console.log('column ', result.prop, ' changed')

        const p = toRef(column.columnProps)
        if (p) {
          tableColumnPropsNames.map(key => {
            if (p[key] === true) {
              // @ts-ignore
              result[key] = toRef(p[key])
            }
          })
        }

        return result
      })
    }) ?? []

  const tableProps = computed(() => {
    console.log('table props changed')
    const result: TableProps<T> = {
      data: data.value,
      defaultExpandAll: originTableProps.defaultExpandAll,
      defaultSort: originTableProps.defaultSort,
    }

    tablePropsNames.forEach(key => {
      if (tablePropsNameMap[key] === true) {
        // @ts-ignore
        result[key] = toRef(originTableProps[key])
      }
    })

    return result
  })

  const result: UseTableReturn<T> = {
    resolvedPagination,
    resolvedColumns,
    tableProps,
    tableSlots: props.tableSlots,
  }

  return result
}

function useFetchTableData<T>(
  initialPageNumber: number,
  originPageSize: MaybeRef<number>,
  originData?: MaybeRef<T[]>,
  fetchTableData?: ProTableProps<T>['fetchTableData']
) {
  const pageNumber = ref(initialPageNumber)
  const pageSize = computed(() => toRef(originPageSize))
  const total = ref(1)
  const data = ref(unref(originData) ?? []) as Ref<T[]>
  const loading = ref(false)

  /**
   * 加载指定页数内容
   */
  async function _fetchTableData(
    pageN: number = pageNumber.value,
    pageS = pageSize.value
  ) {
    if (originData) {
      return
    }

    if (typeof fetchTableData !== 'function') {
      throw new Error('fetchTableData must be function.')
    }

    loading.value = true

    try {
      const tableResult = await fetchTableData(pageN, pageS)
      const { data: d = [], total: t = 1 } = tableResult ?? {}

      data.value = d
      pageNumber.value = pageN
      // pageSize.value = pageS
      total.value = t
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载下一页数据
   */
  function next() {
    return _fetchTableData(pageNumber.value + 1)
  }

  /**
   * 加载上一页数据
   */
  function previous() {
    return _fetchTableData(pageNumber.value - 1)
  }

  return { pageNumber, pageSize, data, loading, total, next, previous }
}
