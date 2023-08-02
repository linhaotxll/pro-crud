import { merge } from 'lodash-es'
import { computed, isRef, nextTick, provide, ref, watch } from 'vue'

import {
  DefaultPageNumber,
  DefaultPageSize,
  DefaultProTableLoading,
  ElTableRefKey,
  ElTableInstanceNames,
  DefaultToolbarTooltip,
  DefaultToolbarSpace,
} from './constant'

import { unRef } from '../common'

import type {
  BuildProTableOptionResult,
  BuildProTableResult,
  InternalProTableColumnProps,
  InternalProTableToolbarOption,
  ProTableInstance,
  ProTableLoading,
  ProTableScope,
  ProTableToolbarOption,
} from './interface'
import type { ElPaginationProps } from '../common'
import type { TableInstance, TableProps } from 'element-plus'
import type { Ref } from 'vue'

export function buildTable<T extends object>(
  options: (
    scope: ProTableScope<T>,
    ctx?: undefined
  ) => BuildProTableOptionResult<T>
): BuildProTableResult<T>
export function buildTable<T extends object, C>(
  options: (scope: ProTableScope<T>, ctx: C) => BuildProTableOptionResult<T>,
  ctx: C
): BuildProTableResult<T>

export function buildTable<T extends object, C>(
  options: (scope: ProTableScope<T>, ctx?: C) => BuildProTableOptionResult<T>,
  ctx?: C | undefined
): BuildProTableResult<T> {
  const elTableRef = ref<TableInstance | null>(null)
  provide(ElTableRefKey, elTableRef)

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
    } as ProTableScope<T>
  )

  const {
    columns = [],
    data: originData,
    tableProps = {},
    tableSlots,
    pagination: originPagination = {},
    loading: originLoading,
    request = {},
    toolbar: originToolbar,
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
      })
      const { data: d = [], total: t = 1 } = tableResult ?? {}

      data.value = d

      total.value = t
    } finally {
      loading.value = false
    }
  }

  // 解析列配置
  const resolvedColumns = columns.map(column => {
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
  })

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
    }

    Object.keys(tableProps).forEach(key => {
      // @ts-ignore
      result[key] = unRef(tableProps[key])
    })

    return result
  })

  // 默认 toolbar
  const defaultToolbar: ProTableToolbarOption = {
    show: true,
    list: {
      reload: {
        tooltip: { content: '刷新' },
        props: {
          icon: 'Refresh',
          onClick: () => {
            scope.reload()
          },
        },
      },

      export: {
        tooltip: { content: '导出' },
        props: {
          icon: 'UploadFilled',
          onClick: () => {
            scope.reload()
          },
        },
      },

      settings: {
        tooltip: { content: '设置' },
        props: {
          icon: 'Tools',
          onClick: () => {
            // scope.reload()
          },
        },
      },
    },
  }

  // 解析 toolbar
  const resolvedToolbar = computed<InternalProTableToolbarOption>(() => {
    console.log('解析 toolbar')
    const toolbar = merge({}, defaultToolbar, unRef(originToolbar))
    const toolbarShow = unRef(toolbar.show!)
    const space = unRef(toolbar.space)

    // debugger
    const list = Object.keys(toolbar.list ?? {})
      .map(key => {
        const show = unRef(
          toolbar.list![key]!.tooltip?.show ??
            DefaultToolbarTooltip.tooltip!.show!
        )
        return merge({}, DefaultToolbarTooltip, toolbar.list![key]!, {
          tooltip: { show },
        })
      })
      .sort((a, b) => (unRef(a.order) ?? 1) - (unRef(b.order) ?? 1))

    console.log('list: ', list)

    return {
      show: toolbarShow,
      list,
      space: merge({}, DefaultToolbarSpace, space),
    }
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

  nextTick(() => {
    reload()
  })

  const proTableRef = ref<ProTableInstance<T> | null>(null)
  const buildProTableResult: BuildProTableResult<T> = {
    proTableRef,
    proTableBinding: {
      columns: resolvedColumns,
      tableProps: resolvedTableProps,
      tableSlots,
      pagination: resolvedPagination,
      loading: resolvedLoadingConfig,
      toolbar: resolvedToolbar,
      scope,
    },
  }

  return buildProTableResult
}
