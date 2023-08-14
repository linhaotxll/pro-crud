import { merge } from 'lodash-es'
import { computed, isRef, nextTick, ref, watch } from 'vue'

import {
  DefaultPageNumber,
  DefaultPageSize,
  DefaultProTableLoading,
  ElTableInstanceNames,
} from './constant'
import { useColumns } from './useColumns'
import { useToolbar } from './useToolbar'

import { resolveRef, unRef } from '../common'

import type {
  BuildProTableOptionResult,
  BuildProTableResult,
  ProTableInstance,
  ProTableLoading,
  ProTableScope,
} from './interface'
import type { ElPaginationProps } from '../common'
import type { TableInstance, TableProps } from 'element-plus'
import type { Ref } from 'vue'

export function buildTable<
  T extends object,
  C = undefined,
  P extends object = any
>(
  options: (
    scope: ProTableScope<T>,
    ctx?: C | undefined
  ) => BuildProTableOptionResult<T, P>
): BuildProTableResult<T>
export function buildTable<T extends object, C, P extends object = any>(
  options: (scope: ProTableScope<T>, ctx: C) => BuildProTableOptionResult<T, P>,
  ctx: C
): BuildProTableResult<T>

export function buildTable<T extends object, C, P extends object = any>(
  options: (
    scope: ProTableScope<T>,
    ctx?: C
  ) => BuildProTableOptionResult<T, P>,
  ctx?: C | undefined
): BuildProTableResult<T> {
  const elTableRef = ref<TableInstance | null>(null)

  // 作用域对象
  const scope = ElTableInstanceNames.reduce(
    (prev, curr) => {
      // @ts-ignore
      prev[curr] = (...args) => elTableRef.value?.[curr](...args)
      return prev
    },
    {
      next,
      previous,
      reset,
      reload,
      _fetProTableColumn,
      _setPropFixed,
      changeColumnVisible,
      changeColumnSort,
    } as ProTableScope<T>
  )

  const {
    columns: originColumns = [],
    data: originData,
    tableProps = {},
    tableSlots,
    pagination: originPagination = {},
    loading: originLoading,
    request = {},
    toolbar: originToolbar,
    params,
  } = options(scope, ctx)
  // debugger

  // 真实数据
  const data = ref([]) as Ref<T[]>

  // 加载状态
  const loading = ref(false)

  // 分页
  const p = unRef(originPagination)
  const pageNumber = ref(
    p !== false ? p?.defaultCurrentPage ?? DefaultPageNumber : DefaultPageNumber
  )
  const pageSize = ref(
    p !== false ? p?.defaultPageSize ?? DefaultPageSize : DefaultPageSize
  )
  const total = ref(1)

  // 初始页数
  const initialPageNumber = pageNumber.value

  const { columns, columnsShow, sort, setFixed } = useColumns(originColumns)

  const { toolbar, tableSize } = useToolbar(tableProps, originToolbar, scope)

  let resolvedParams = unRef(params)

  // 监听 params 变化，自动发起请求
  if (params) {
    watch(resolveRef(params), p => {
      resolvedParams = p
      reset()
    })
  }

  /**
   * 加载指定页数内容
   */
  async function _fetchTableData(
    pageN: number = pageNumber.value,
    pageS = pageSize.value
  ) {
    if (originData) {
      watch(
        isRef(originData) ? originData : () => originData,
        _d => {
          data.value = _d as T[]
        },
        { immediate: true }
      )
      return
    }

    if (typeof request.fetchTableData !== 'function') {
      throw new Error('fetchTableData must be function.')
    }

    loading.value = true
    pageNumber.value = pageN
    pageSize.value = pageS

    try {
      const tableResult = await request.fetchTableData({
        page: { pageNumber: pageN, pageSize: pageS },
        params: resolvedParams,
      })
      const { data: d = [], total: t = 1 } = tableResult ?? {}

      data.value = d

      total.value = t
    } finally {
      loading.value = false
    }
  }

  // 解析 loading 配置
  const resolvedLoadingConfig = computed<ProTableLoading>(() => {
    const mergeLoading = merge({}, DefaultProTableLoading, unRef(originLoading))
    return {
      visible: loading.value,
      text: unRef(mergeLoading?.text),
      background: unRef(mergeLoading?.background),
      spinner: unRef(mergeLoading?.spinner),
      svg: unRef(mergeLoading?.svg),
    }
  })

  // 解析分页配置
  const resolvedPagination = computed<false | ElPaginationProps>(() => {
    const pagination = unRef(originPagination)
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

  // 解析 table props
  const resolvedTableProps = computed(() => {
    const result: TableProps<T> = {
      data: data.value,
      defaultExpandAll: tableProps.defaultExpandAll,
      defaultSort: tableProps.defaultSort,
      size: unRef(tableSize),
    }

    Object.keys(tableProps).forEach(key => {
      // @ts-ignore
      result[key] = unRef(tableProps[key])
    })

    return result
  })

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

  /**
   * 获取所有列配置
   */
  function _fetProTableColumn() {
    return columns
  }

  /**
   * 修改列显示状态
   */
  function changeColumnVisible(prop: string, visible: boolean) {
    columnsShow[prop] = visible
  }

  /**
   * 修改列顺序
   */
  function changeColumnSort(fromIndex: number, toIndex: number) {
    sort(fromIndex, toIndex)
  }

  /**
   *
   */
  function _setPropFixed(prop: string, fixed?: boolean | string) {
    setFixed(prop, fixed)
  }

  nextTick(() => {
    reload()
  })

  const proTableRef = ref<ProTableInstance<T> | null>(null)
  const buildProTableResult: BuildProTableResult<T> = {
    proTableRef,
    proTableBinding: {
      columns,
      tableProps: resolvedTableProps,
      tableSlots,
      pagination: resolvedPagination,
      loading: resolvedLoadingConfig,
      toolbar,
      scope,
      tableRef: elTableRef,
    },
  }

  return buildProTableResult
}
