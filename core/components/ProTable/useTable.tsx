import { merge } from 'lodash-es'
import { computed, unref, ref, nextTick } from 'vue'

import { DefaultProTableLoading } from './constant'

import { unRef } from '../common'

import type {
  InternalProTableColumnProps,
  ProTableLoading,
  ProTableProps,
  UseTableReturn,
} from './interface'
import type { MaybeRef } from '../common/interface'
import type { TableInstance, TableProps } from 'element-plus'
import type { Ref } from 'vue'

const DefaultPageNumber = 1
const DefaultPageSize = 10

export function useTable<T extends object>(props: ProTableProps<T>) {
  const tableRef = ref<TableInstance | null>(null)

  const { tableProps: originTableProps = {} } = props

  const {
    pageNumber,
    pageSize,
    total,
    data,
    loading,
    reload,
    reset,
    next,
    previous,
  } = useFetchTableData(props.pagination, props.data, props.fetchTableData)

  const resolvedPagination = computed(() => {
    const pagination = unref(props.pagination)
    if (pagination === false) {
      return false
    }

    return {
      layout: '->, prev, pager, next, jumper',
      ...pagination,
      pageSize: pageSize.value,
      currentPage: pageNumber.value,
      'onUpdate:currentPage': (pageN: number) => {
        reload(pageN)
      },

      'onUpdate:pageSize'(pageSize: number) {
        reload(undefined, pageSize)
      },
      total: total.value,
    }
  })

  const resolvedColumns =
    props.columns?.map(column => {
      return computed(() => {
        const result: InternalProTableColumnProps<T> = {
          columnProps: {
            label: unRef(column.label),
            prop: unRef(column.prop),
          },
          columnSlots: column.columnSlots,
        }

        const p = unRef(column.columnProps)
        if (p) {
          Object.keys(p).forEach(key => {
            // @ts-ignore
            result.columnProps[key] = unRef(p[key])
          })
        }

        return result
      })
    }) ?? []

  const tableProps = computed(() => {
    const result: TableProps<T> = {
      data: data.value,
      defaultExpandAll: originTableProps.defaultExpandAll,
      defaultSort: originTableProps.defaultSort,
    }

    Object.keys(originTableProps).forEach(key => {
      // @ts-ignore
      result[key] = unRef(originTableProps[key])
    })

    return result
  })

  const loadingConfig = computed<ProTableLoading>(() => {
    const originLoading = merge(
      {},
      DefaultProTableLoading,
      unRef(props.loading)
    )
    return {
      visible: loading.value,
      text: unRef(originLoading?.text),
      background: unRef(originLoading?.background),
      spinner: unRef(originLoading?.spinner),
      svg: unRef(originLoading?.svg),
    }
  })

  const result: UseTableReturn<T> = {
    resolvedPagination,
    resolvedColumns,
    tableProps,
    tableSlots: props.tableSlots,
    loadingConfig,
    clearSelection() {
      return tableRef.value?.clearSelection()
    },
    getSelectionRows() {
      return tableRef.value?.getSelectionRows() as T[] | undefined
    },
    toggleRowSelection(row: T, selected: boolean) {
      return tableRef.value?.toggleRowExpansion(row, selected)
    },
    toggleAllSelection() {
      return tableRef.value?.toggleAllSelection()
    },
    toggleRowExpansion(row: T, expanded: boolean | undefined) {
      return tableRef.value?.toggleRowExpansion(row, expanded)
    },
    setCurrentRow(row: T) {
      return tableRef.value?.setCurrentRow(row)
    },
    clearSort() {
      return tableRef.value?.clearSort()
    },
    clearFilter(columnKeys: string[]) {
      return tableRef.value?.clearFilter(columnKeys)
    },
    doLayout() {
      return tableRef.value?.doLayout()
    },
    sort(prop: string, order: string) {
      return tableRef.value?.sort(prop, order)
    },
    scrollTo(options: number | ScrollToOptions, yCoord?: number | undefined) {
      return tableRef.value?.scrollTo(options, yCoord)
    },
    setScrollTop(top: number | undefined) {
      return tableRef.value?.setScrollTop(top)
    },
    setScrollLeft(left: number | undefined) {
      return tableRef.value?.setScrollLeft(left)
    },

    reload,
    next,
    previous,
    reset,
  }

  return result
}

function useFetchTableData<T extends object>(
  paginationConfig: ProTableProps<T>['pagination'],
  originData?: MaybeRef<T[]>,
  fetchTableData?: ProTableProps<T>['fetchTableData']
) {
  const pagination = unRef(paginationConfig)

  const pageNumber = ref(
    pagination !== false
      ? pagination?.defaultCurrentPage ?? DefaultPageNumber
      : DefaultPageNumber
  )
  const pageSize = ref(
    pagination !== false
      ? pagination?.defaultPageSize ?? DefaultPageSize
      : DefaultPageSize
  )

  const initialPageNumber = pageNumber.value
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
    pageNumber.value = pageN
    pageSize.value = pageS

    try {
      const tableResult = await fetchTableData({
        page: { pageNumber: pageN, pageSize: pageS },
      })
      const { data: d = [], total: t = 1 } = tableResult ?? {}

      data.value = d

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

  /**
   * 重新加载当前页数据
   */
  function reload(pageNumber?: number, pageSize?: number) {
    return _fetchTableData(pageNumber, pageSize)
  }

  /**
   * 恢复默认页重新加载
   */
  function reset() {
    return _fetchTableData(initialPageNumber)
  }

  nextTick(() => {
    // debugger
    reload()
  })

  return {
    pageNumber,
    pageSize,
    data,
    loading,
    total,
    reload,
    reset,
    next,
    previous,
  }
}
