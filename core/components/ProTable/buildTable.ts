import { toRef } from '@vueuse/core'
import { toValue } from '@vueuse/core'
import { once } from 'lodash-es'
import { computed, isRef, ref, unref, watch } from 'vue'

import { buildTableColumn } from './buildTableColumn'
import {
  buildDefaultToolbar,
  TableActionColumnOptions,
  TableContainerProps,
  tableSlotKey,
} from './constant'
import {
  createCustomFilterDropdown,
  createCustomFilterIcon,
  renderBodyCellText,
  renderHeaderCellText,
} from './renderBodyCell'

import { fetchWithLoding, mergeWithTovalue } from '../common'
import { buildButtonGroup } from '../ProButton'
import { buildSearch } from '../ProForm'

import { isArray, isFunction, isPlainObject } from '~/utils'

import type { TableSlotFn, TableSlotKey, TableSlotValueKey } from './constant'
import type {
  BuildProTableOptionResult,
  BuildTableResult,
  FetchProTablePageListResult,
  InternalProTableSearchOptions,
  ProTableColumnProps,
  ProTableScope,
  ProTableToolbarActions,
} from './interface'
import type { InternalProTableColumnProps } from './internal'
import type { DataObject } from '../common'
import type { ProFormColumnOptions } from '../ProForm'
import type { FlexProps, TableProps } from 'ant-design-vue'
import type { Ref } from 'vue'

export function buildTable<
  Data extends DataObject = DataObject,
  Params = any,
  Collection = any,
  SearchForm extends DataObject = DataObject,
  SearchFormSubmit extends DataObject = SearchForm
>(
  options: (
    scope: ProTableScope<Data>
  ) => BuildProTableOptionResult<
    Data,
    Params,
    Collection,
    SearchForm,
    SearchFormSubmit
  >
): BuildTableResult<Data> {
  // ProTable 作用域对象
  const scope: ProTableScope<Data> = {
    reload,
    reset,
    previous,
    next,
  }

  const optionResult = options(scope)

  const {
    data,
    defaultData,
    immediate = true,
    tableProps,
    params,
    columns,
    search,
    actionColumn,
    toolbar,
    wrapperProps,
    renderWrapper,
    fetchDictionaryCollection,
    fetchTableData,
    onDataSourceChange,
    postData,
    onLoad,
    onLoadingChange,
    onRequestError,
  } = optionResult

  // 在 pagination 中获取初始页数配置
  let defaultCurrent = 1
  let defaultPageSize = 10
  const initialPagination = toValue(toValue(tableProps)?.pagination)
  if (initialPagination !== false) {
    defaultCurrent = toValue(initialPagination?.current) ?? defaultCurrent
    defaultPageSize = toValue(initialPagination?.pageSize) ?? defaultPageSize
  }

  // 当前页
  const currentPage = ref(defaultCurrent)
  // 每页数据数量
  const currentPageSize = ref(defaultPageSize)
  // TODO: 是否还有下一页数据
  // const hasMore = ref(false)
  // 实际的数据集合
  const resolvedData = ref(defaultData ?? []) as Ref<Data[]>
  // 请求 loading
  const loading = ref(false)

  // 解析包裹 flex 属性
  const resolvedWrapperProps = computed<FlexProps>(() =>
    mergeWithTovalue({}, TableContainerProps, toValue(wrapperProps))
  )

  // 解析渲染包裹元素的函数
  const resolvedRenderWrapper = isRef(renderWrapper)
    ? computed(() => toValue(renderWrapper))
    : renderWrapper

  // 解析 toolbar
  const resolvedToolbar = buildButtonGroup<ProTableToolbarActions, {}>(
    toolbar,
    buildDefaultToolbar(scope)
  )

  // 只调用一次的获取集合函数
  const fetchDictionaryCollectionOnce = isFunction(fetchDictionaryCollection)
    ? once(fetchDictionaryCollection)
    : undefined

  // 解析完成构建 Table 列配置
  const resolvedTableColumns = ref([]) as Ref<
    InternalProTableColumnProps<Data>[]
  >
  // 解析完成构建 ProSearch 列配置
  const resolvedSearchColumns = ref([]) as Ref<
    ProFormColumnOptions<Data, any, Collection>[]
  >

  // 监听列变化，解析列配置
  if (columns) {
    watch(
      toRef(columns),
      _columns => {
        resolvedTableColumns.value = []
        resolvedSearchColumns.value = []
        const { search, table } = _columns.reduce(
          (prev, curr) => {
            // 合并搜索列配置，type 和 dict 只能使用 table column 上的配置
            // 其余可以在 search 中单独配置
            prev.search.push(
              mergeWithTovalue(
                {},
                { label: curr.label, name: curr.name },
                toValue(curr.search),
                { type: curr.type, dict: curr.dict }
              )
            )
            // 构建 table column
            const tableColumnOptions = buildTableColumn(
              curr,
              fetchDictionaryCollectionOnce
            )
            // 只会将需要展示的列存入最终结果中
            if (tableColumnOptions) {
              prev.table.push(tableColumnOptions)
            }

            return prev
          },
          {
            search: [],
            table: [],
          } as {
            search: ProFormColumnOptions<Data, any, Collection>[]
            table: InternalProTableColumnProps<Data>[]
          }
        )

        resolvedTableColumns.value = table
        resolvedSearchColumns.value = search
      },
      { immediate: true, deep: true }
    )
  }

  // 解析操作列配置
  const resolvedActionColumn = actionColumn
    ? computed(() => {
        const { action, ...column } = toValue(actionColumn)
        const c = buildTableColumn(
          mergeWithTovalue({}, TableActionColumnOptions, column)
        )
        if (c) {
          c._column.action = buildButtonGroup(action)
        }

        return c
      })
    : undefined

  // 解析 Table Props
  const resolvedTableProps = computed<TableProps<Data>>(() => {
    const tablePropsValue = toValue(tableProps)
    const propsValue = mergeWithTovalue<TableProps<Data>>(
      {
        components: extractComponents(optionResult),
      },
      tablePropsValue,
      {
        loading,
        dataSource: resolvedData,
        columns: computed(() =>
          resolvedActionColumn && resolvedActionColumn.value
            ? resolvedTableColumns.value.concat(resolvedActionColumn.value)
            : resolvedTableColumns.value
        ),
      }
    )

    // 合并分页配置
    if (propsValue.pagination !== false) {
      propsValue.pagination = mergeWithTovalue(
        {},
        toValue(propsValue.pagination),
        {
          'onUpdate:current'(pageNum: number) {
            _fetchTableData(pageNum)
          },
          'onUpdate:pageSize'(pageSize: number) {
            _fetchTableData(undefined, pageSize)
          },
          current: currentPage.value,
          pageSize: currentPageSize.value,
        }
      )
    }

    return propsValue
  })

  // 解析 Table Slots
  // 遍历 tableSlotKey，将可能存在的 slot 记录下来
  // renderFilterIcon 和 renderFilterDropdown 需要创建一个新的函数
  // 优先渲染列配置上的 slot，如果没有再渲染 table 上的 slot
  const resolvedTableSlots = computed(() => {
    return Object.keys(tableSlotKey).reduce(
      (prev, curr) => {
        const key = curr as TableSlotKey
        if (optionResult[key]) {
          let fn = unref(optionResult[key])

          if (key === 'renderFilterIcon' && fn) {
            fn = createCustomFilterIcon(
              fn as Parameters<typeof createCustomFilterIcon>[0]
            )
          }
          if (key === 'renderFilterDropdown' && fn) {
            fn = createCustomFilterDropdown(
              fn as Parameters<typeof createCustomFilterDropdown>[0]
            )
          }

          if (fn) {
            prev[tableSlotKey[key]] = fn
          }
        }
        return prev
      },
      // 默认包含 bodyCell 和 headerCell 的插槽
      {
        bodyCell: renderBodyCellText,
        headerCell: renderHeaderCellText,
      } as Record<TableSlotValueKey, TableSlotFn>
    )
  })

  // 解析 search
  const resolvedSearch = computed<InternalProTableSearchOptions<SearchForm>>(
    () => {
      const searchValue = toValue(search)
      if (searchValue === false) {
        return false
      }

      // @ts-ignore
      return buildSearch(scope => {
        return {
          ...(isFunction(searchValue) ? searchValue(scope) : searchValue),
          columns: resolvedSearchColumns,
        }
      }).proFormBinding
    }
  )

  // 监听 loading 变化
  if (isFunction(onLoadingChange)) {
    watch(loading, _loading => {
      onLoadingChange(_loading)
    })
  }

  // 监听数据变化
  if (isFunction(onDataSourceChange)) {
    watch(resolvedData, _data => {
      onDataSourceChange(_data)
    })
  }

  /**
   * 是否是分页数据
   */
  function isPaginationData(
    value: unknown
  ): value is FetchProTablePageListResult<Data> {
    return isPlainObject(value) && !isArray(value)
  }

  /**
   * 获取数据
   */
  async function _fetchTableData(pageNum?: number, pageSize?: number) {
    fetchWithLoding(
      loading,
      () => {
        let res:
          | Data[]
          | FetchProTablePageListResult<Data>
          | Promise<Data[] | FetchProTablePageListResult<Data>>

        if (isFunction(fetchTableData)) {
          res = fetchTableData({
            page: {
              pageNum: pageNum ?? currentPage.value,
              pageSize: pageSize ?? currentPageSize.value,
            },
            params: toValue(params),
          })
        } else {
          res = toValue(data) ?? resolvedData.value
        }

        return res
      },
      res => {
        let _resolvedData: Data[]
        if (isPaginationData(res)) {
          _resolvedData = res.data
        } else {
          _resolvedData = res
        }

        if (isFunction(postData)) {
          _resolvedData = postData(_resolvedData)
        }

        if (isFunction(onLoad)) {
          onLoad(_resolvedData)
        }

        resolvedData.value = _resolvedData
      },
      onRequestError,
      () => {
        pageNum && (currentPage.value = pageNum)
        pageSize && (currentPageSize.value = pageSize)
      }
    )
  }

  // 如果 data 和 params 是响应式才需要监听
  if (isRef(data) || isRef(params)) {
    watch(
      [data, params],
      () => {
        _fetchTableData()
      },
      { immediate: true, deep: true }
    )
  } else {
    if (immediate) {
      _fetchTableData()
    }
  }

  /**
   * 重新加载当前页数据
   */
  function reload() {
    return _fetchTableData()
  }

  /**
   * 恢复默认页重新加载
   */
  function reset() {
    return _fetchTableData(1)
  }

  /**
   * 跳转上一页
   */
  function previous() {
    return _fetchTableData(currentPage.value - 1)
  }

  /**
   * 加载下一页
   */
  function next() {
    return _fetchTableData(currentPage.value + 1)
  }

  return {
    proTableBinding: {
      tableProps: resolvedTableProps,
      tableSlots: resolvedTableSlots,
      wrapperProps: resolvedWrapperProps,
      renderWrapper: resolvedRenderWrapper,
      toolbar: resolvedToolbar,
      search: resolvedSearch,
    },
  }
}

const renderComponentsKey = [
  'renderTable',
  'renderHeaderWrapper',
  'renderHeaderRow',
  'renderHeaderCell',
  'renderBodyWrapper',
  'renderBodyRow',
  'renderBodyCell',
  'renderBody',
] as const

const renderComponentsName = {
  renderTable: 'table',
  renderHeaderWrapper: 'wrapper',
  renderHeaderRow: 'row',
  renderHeaderCell: 'cell',
  renderBodyWrapper: 'wrapper',
  renderBodyRow: 'row',
  renderBodyCell: 'cell',
  // renderBody 优先级最高
  renderBody: 'body',
} as const

function extractComponents(optionsResult: BuildProTableOptionResult) {
  let components: any
  for (const key of renderComponentsKey) {
    if (optionsResult[key]) {
      components ||= {}

      if (key === 'renderTable') {
        components[renderComponentsName[key]] = unref(optionsResult[key])
      } else if (
        key === 'renderHeaderCell' ||
        key === 'renderHeaderRow' ||
        key === 'renderHeaderWrapper'
      ) {
        components.header ||= {}
        components.header[renderComponentsName[key]] = unref(optionsResult[key])
      } else if (
        key === 'renderBodyWrapper' ||
        key === 'renderBodyRow' ||
        key === 'renderBodyCell'
      ) {
        components.body ||= {}
        components.body[renderComponentsName[key]] = unref(optionsResult[key])
      } else if (key === 'renderBody') {
        components[renderComponentsName[key]] = unref(optionsResult[key])
      }
    }
  }

  return components
}
