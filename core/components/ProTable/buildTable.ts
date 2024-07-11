import { toRef } from '@vueuse/core'
import { once, set } from 'lodash-es'
import {
  computed,
  isRef,
  reactive,
  ref,
  toValue,
  unref,
  watch,
  watchEffect,
} from 'vue'

import { buildTableColumn } from './buildTableColumn'
import {
  buildDefaultToolbar,
  buildTableActionColumnOptions,
  TableContainerProps,
  buildTableEditableDefaultOption,
  tableSlotKey,
  TableEditableNamePlaceholder,
  getRowKey,
  extractComponents,
} from './constant'
import {
  createCustomFilterDropdown,
  createCustomFilterIcon,
  renderBodyCellText,
  renderHeaderCellText,
} from './renderBodyCell'

import {
  compose,
  fetchWithLoding,
  mergeWithNormal,
  mergeWithTovalue,
} from '../common'
import { buildButtonGroup } from '../ProButton'
import { buildForm, buildSearch } from '../ProForm'
import { showToast } from '../Toast'

import { isArray, isFunction, isNil, isPlainObject } from '~/utils'

import type { TableSlotFn, TableSlotKey, TableSlotValueKey } from './constant'
import type {
  BuildProTableOptionResult,
  BuildTableBinding,
  BuildTableOption,
  BuildTableResult,
  FetchProTablePageListResult,
  ProTableScope,
  ProTableScopeWithSearch,
  ProTableToolbarActions,
} from './interface'
import type {
  InternalEditableKeys,
  InternalProTableColumnProps,
  InternalProTableEditableOptions,
} from './internal'
import type { DataObject, NamePath, NextMiddleware } from '../common'
import type { ProFormColumnOptions, ProFormScope } from '../ProForm'
import type { FlexProps, TableProps } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { GetRowKey } from 'ant-design-vue/es/vc-table/interface'
import type { ComputedRef, Ref } from 'vue'

interface BuildTableContext<
  Data extends DataObject = DataObject,
  Params = any,
  Collection = any,
  SearchForm extends DataObject = DataObject,
  SearchFormSubmit extends DataObject = SearchForm
> {
  options: BuildTableOption<
    Data,
    Params,
    Collection,
    SearchForm,
    SearchFormSubmit
  >
  scope: ProTableScopeWithSearch<Data>
  optionResult: BuildProTableOptionResult

  columns: {
    table: Ref<Ref<InternalProTableColumnProps<Data>>[]>
    search: Ref<ProFormColumnOptions<Data, any, Collection>[]>
    editable: Ref<ProFormColumnOptions<Data, any, Collection>[]>
  }

  tableBindings: Omit<BuildTableBinding<Data, SearchForm>, 'search'>
  searchBindings: BuildTableBinding<Data, SearchForm>['search']
}

export function buildTable<
  Data extends DataObject = DataObject,
  Params = any,
  Collection = any,
  SearchForm extends DataObject = DataObject,
  SearchFormSubmit extends DataObject = SearchForm
>(
  options: BuildTableOption<
    Data,
    Params,
    Collection,
    SearchForm,
    SearchFormSubmit
  >
): BuildTableResult<Data> {
  const context: BuildTableContext = {
    options,
    scope: {
      table: null!,
      search: null!,
    },
    columns: {
      table: null!,
      search: null!,
      editable: null!,
    },
    optionResult: null!,
    tableBindings: null!,
    searchBindings: null!,
  }

  compose<BuildTableContext>([
    buildTableMiddleware,
    buildSearchMiddleware,
    buildBasicMiddleware,
  ])(context)

  return {
    proTableBinding: {
      ...context.tableBindings,
      search: context.searchBindings,
    },
  }
}

function buildTableMiddleware<Data extends DataObject = DataObject>(
  ctx: BuildTableContext,
  nextMiddleware: () => void
) {
  // ProTable 作用域对象
  const scope: ProTableScope<any> = {
    reload,
    reset,
    previous,
    next,
    startEdit,
    cancelEdit,
    getEditableRowData,
    setEditableRowData,
    getEditableRowsData,
    clearEditableRowData,
  }

  ctx.scope.table = scope

  nextMiddleware()

  const {
    data,
    defaultData,
    immediate = true,
    tableProps,
    params,
    actionColumn = {},
    toolbar,
    wrapperProps,
    renderWrapper,
    editable = false,
    fetchTableData,
    onDataSourceChange,
    postData,
    onLoad,
    onLoadingChange,
    onRequestError,
  } = ctx.optionResult

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
  const resolvedDataRowkeyMap = computed(() => {
    const rowKey = unref(toValue(tableProps)?.rowKey)
    const getRowKey = isFunction(rowKey)
      ? (rowKey as GetRowKey<Data>)
      : (record: Data) => record[rowKey as Key]

    return resolvedData.value.reduce((prev, curr, i) => {
      const key = getRowKey(curr, i)
      if (!isNil(key)) {
        prev[key] = curr
      }
      return prev
    }, {} as Record<Key, Data>)
  })
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
    buildDefaultToolbar(ctx.scope)
  )

  // 解析编辑配置
  const resolvedEditable: ComputedRef<InternalProTableEditableOptions<Data>> =
    computed(() => {
      const editableValue = toValue(editable)
      if (editableValue === false) {
        return false
      }

      let formScope: ProFormScope<Data>

      // @ts-ignore
      const editFormBinding = buildForm<Data>(scope => {
        formScope = scope

        return {
          ...(isFunction(editableValue.form)
            ? editableValue.form(scope)
            : editableValue.form),
          columns: ctx.columns.editable,
        }
      }).proFormBinding

      return mergeWithTovalue(
        { editFormBinding, formScope: formScope! },
        buildTableEditableDefaultOption(
          ctx.scope,
          resolvedTableProps,
          resolvedEditable
        ),
        editableValue
      )
    })

  // // 只调用一次的获取集合函数
  // const fetchDictionaryCollectionOnce = isFunction(fetchDictionaryCollection)
  //   ? once(fetchDictionaryCollection)
  //   : undefined

  // // 解析完成构建 Table 列配
  // const resolvedTableColumns = ref([]) as Ref<
  //   Ref<InternalProTableColumnProps<Data>>[]
  // >

  // // 解析完成构建 ProSearch 列配置
  // const resolvedSearchColumns = ref([]) as Ref<
  //   ProFormColumnOptions<Data, any, Collection>[]
  // >

  // // 解析完成构建 ProTable Editable 列配置
  // const resolvedProTableEditableColumns = ref([]) as Ref<
  //   ProFormColumnOptions<Data, any, Collection>[]
  // >

  // // 监听列变化，解析列配置
  // if (columns) {
  //   watch(
  //     toRef(columns),
  //     _columns => {
  //       resolvedTableColumns.value = []
  //       resolvedSearchColumns.value = []
  //       const { search, table, editable } = _columns.reduce(
  //         (prev, curr, i) => {
  //           // 构建 table column
  //           const tableColumnOptions = buildTableColumn(
  //             curr,
  //             i,
  //             fetchDictionaryCollectionOnce
  //           )
  //           // 将解析好的列存入最终结果中
  //           prev.table.push(tableColumnOptions)

  //           const { type, name } = toValue(tableColumnOptions)._column

  //           // 合并搜索列配置，type 和 dict 只能使用 table column 上的配置
  //           // 其余可以在 search 中单独配置
  //           const searchOptions = mergeWithTovalue(
  //             { label: curr.label, name: curr.name },
  //             toValue(curr.form),
  //             toValue(curr.search),
  //             { type }
  //           )

  //           // 合并编辑列配置，type、dict 和 name 只能使用 table column 上的配置
  //           // 其余可以在 editableForm 中单独配置
  //           const editableOptions = mergeWithTovalue(
  //             { label: curr.label },
  //             toValue(curr.form),
  //             toValue(curr.editableForm),
  //             {
  //               type,
  //               itemProps: { noStyle: true },
  //               name: ['table', TableEditableNamePlaceholder, name],
  //             }
  //           )

  //           // search 和 table 的 dict 要保持是同一个对象，不能被 merge 克隆
  //           if (curr.dict) {
  //             editableOptions.dict = searchOptions.dict = curr.dict
  //           }

  //           prev.search.push(searchOptions)
  //           prev.editable.push(editableOptions)

  //           return prev
  //         },
  //         {
  //           search: [],
  //           table: [],
  //           editable: [],
  //         } as {
  //           search: ProFormColumnOptions<Data, any, Collection>[]
  //           editable: ProFormColumnOptions<Data, any, Collection>[]
  //           table: Ref<InternalProTableColumnProps<Data>>[]
  //         }
  //       )

  //       resolvedTableColumns.value = table
  //       resolvedSearchColumns.value = search
  //       resolvedProTableEditableColumns.value = editable
  //     },
  //     { immediate: true, deep: true }
  //   )
  // }

  // 解析操作列配置
  const resolvedActionColumn = computed(() => {
    const actionColumnValue = toValue(actionColumn)

    const { action, ...column } = actionColumnValue

    const c = buildTableColumn(
      mergeWithTovalue(
        { show: false },
        buildTableActionColumnOptions(
          action,
          resolvedEditable,
          ctx.scope,
          resolvedTableProps,
          internalEditableKeysMap
        ),
        column
      ),
      ctx.columns.table.value.length
    )

    return c.value
  })

  // 解析 Table Props
  const resolvedTableProps = computed<TableProps<Data>>(() => {
    const tablePropsValue = toValue(tableProps)

    // 过滤不展示的列
    const filterColumns: InternalProTableColumnProps<Data>[] = []
    for (const c of ctx.columns.table.value) {
      if (c.value._column.show) {
        filterColumns.push(c.value)
      }
    }

    // 如果操作列展示
    if (
      resolvedActionColumn.value?._column.show ||
      resolvedEditable.value !== false
    ) {
      filterColumns.push(resolvedActionColumn.value)
    }

    const propsValue = mergeWithTovalue<TableProps<Data>>(
      {
        components: extractComponents(ctx.optionResult),
        rowKey: 'key',
      },
      tablePropsValue,
      {
        loading,
        dataSource: resolvedData,
        columns: filterColumns,
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
        if (ctx.optionResult[key]) {
          let fn = unref(ctx.optionResult[key])

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
        bodyCell: ctx =>
          renderBodyCellText(
            ctx,
            internalEditableKeysMap,
            resolvedEditable,
            resolvedTableProps
          ),
        headerCell: renderHeaderCellText,
      } as Record<TableSlotValueKey, TableSlotFn>
    )
  })

  // // 解析 search
  // const resolvedSearch = computed<InternalProTableSearchOptions<SearchForm>>(
  //   () => {
  //     const searchValue = toValue(search)
  //     if (searchValue === false) {
  //       return false
  //     }

  //     // @ts-ignore
  //     return buildSearch(scope => {
  //       return {
  //         ...(isFunction(searchValue) ? searchValue(scope) : searchValue),
  //         columns: resolvedSearchColumns,
  //       }
  //     }).proFormBinding
  //   }
  // )

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

  const internalEditableKeysMap = reactive(new Map()) as InternalEditableKeys

  watchEffect(() => {
    const editableValue = toValue(resolvedEditable)
    if (editableValue === false) {
      return
    }

    if (isArray(editableValue.editableKeys)) {
      for (const curr of editableValue.editableKeys) {
        if (isArray(curr)) {
          handleChangeEditkeys(curr[0], curr[1])
        } else {
          handleChangeEditkeys(curr)
        }
      }
    }
  })

  function handleChangeEditkeys(rowKey: Key, columnName?: NamePath[]) {
    if (!isNil(columnName)) {
      const columnNames = internalEditableKeysMap.get(rowKey) ?? []
      if (isArray(columnNames)) {
        const newColumnNames = columnNames.slice()
        newColumnNames.push(...columnName)
        internalEditableKeysMap.set(rowKey, newColumnNames)
      }
    } else {
      internalEditableKeysMap.set(rowKey, true)
    }
    scope.setEditableRowData(rowKey, { ...resolvedDataRowkeyMap.value[rowKey] })
  }

  /**
   * 开始编辑
   */
  function startEdit(rowKey: Key, columnNames?: NamePath[]) {
    if (isNil(rowKey)) {
      throw new Error('indexOrRowKey is required')
    }

    const editableValue = isEnableEditable()
    if (!editableValue) {
      return
    }

    const { type } = editableValue
    if (type === 'single') {
      if (internalEditableKeysMap.size > 0) {
        showToast(editableValue.onlyEditOneLineToast)
      } else {
        handleChangeEditkeys(rowKey, columnNames)
      }
    } else if (type === 'multiple') {
      handleChangeEditkeys(rowKey, columnNames)
    }
  }

  /**
   * 取消编辑
   */
  function cancelEdit(rowKey: Key, columnNames?: NamePath[]) {
    const editableValue = toValue(resolvedEditable)
    if (editableValue === false) {
      return
    }

    if (isNil(rowKey)) {
      throw new Error('indexOrRowKey is required')
    }

    if (isNil(columnNames)) {
      if (internalEditableKeysMap.size > 0) {
        internalEditableKeysMap.delete(rowKey)
      }
    } else {
      const columnNames = internalEditableKeysMap.get(rowKey)
      if (isArray(columnNames)) {
        const newColumnNames = columnNames.slice()
        for (const c of columnNames) {
          const index = newColumnNames.indexOf(c)
          if (index !== -1) {
            newColumnNames.splice(index, 1)
          }
        }
        internalEditableKeysMap.set(rowKey, newColumnNames)
        //
      }
    }
  }

  /**
   * 设置一行编辑的数据
   */
  function setEditableRowData(rowKey: Key, data: Partial<Data>) {
    const editableValue = isEnableEditable()
    if (editableValue) {
      editableValue.formScope.setFieldValue(['table', rowKey], data)
    }
  }

  /**
   * 获取一行编辑的数据
   */
  function getEditableRowData(rowKey: Key) {
    const editableValue = isEnableEditable()
    if (editableValue) {
      return mergeRecordWithEditableForm(rowKey, editableValue)
    }
  }

  /**
   * 获取所有行编辑的数据
   */
  function getEditableRowsData(): Data[] | null {
    let result: Data[] | null = null
    const editableValue = isEnableEditable()
    if (editableValue) {
      const tableProps = toValue(resolvedTableProps)
      const dataSource = resolvedData.value
      for (const data of dataSource) {
        const res = getEditableRowData(getRowKey(data, tableProps))
        if (res) {
          ;(result ||= []).push(res)
        }
      }
    }
    return result
  }

  /**
   * 清空一行的编辑数据
   */
  function clearEditableRowData(rowKey: Key) {
    const editableValue = isEnableEditable()
    if (editableValue) {
      const columns = ctx.columns.table.value
      const result: Partial<Data> = {}
      for (const column of columns) {
        const {
          _column: { name },
        } = toValue(column)
        let editable = false
        const keys = internalEditableKeysMap.get(rowKey)
        if (name && keys) {
          if (keys === true) {
            editable = true
          } else {
            editable = keys.includes(name)
          }
          if (editable) {
            set(result, name, undefined)
          }
        }
      }
      editableValue.formScope.setFieldValue(['table', rowKey], result)
    }
  }

  /**
   * 是否开启编辑
   */
  function isEnableEditable() {
    const editableValue = toValue(resolvedEditable)
    return editableValue !== false ? editableValue : null
  }

  /**
   * 合并编辑数据和原始数据
   */
  function mergeRecordWithEditableForm(
    rowKey: Key,
    editableValue: ReturnType<typeof isEnableEditable>
  ): Data {
    return mergeWithNormal(
      {},
      resolvedDataRowkeyMap.value[rowKey],
      editableValue?.formScope.getFieldValue(['table', rowKey])
    )
  }

  ctx.tableBindings = {
    tableProps: resolvedTableProps,
    tableSlots: resolvedTableSlots,
    wrapperProps: resolvedWrapperProps,
    renderWrapper: resolvedRenderWrapper,
    toolbar: resolvedToolbar,
    editable: resolvedEditable,
  }
}

function buildSearchMiddleware<SearchForm extends DataObject = DataObject>(
  ctx: BuildTableContext,
  next: NextMiddleware
) {
  const { proFormBinding } = buildSearch<SearchForm>(scope => {
    ctx.scope.search = scope

    next()

    // const searchValue = toValue(ctx.optionResult.search)

    // if (searchValue === false) {
    //   return {}
    // }

    return {
      // ...(isFunction(searchValue) ? searchValue(scope) : searchValue),
      columns: computed(() => {
        const searchValue = toValue(ctx.optionResult.search)
        return searchValue === false ? [] : ctx.columns.search.value
      }),
    }
  })

  ctx.searchBindings = proFormBinding
}

function buildBasicMiddleware<
  Data extends DataObject = DataObject,
  Collection = any
>(ctx: BuildTableContext) {
  const { columns, fetchDictionaryCollection } = (ctx.optionResult =
    ctx.options(ctx.scope))

  // 只调用一次的获取集合函数
  const fetchDictionaryCollectionOnce = isFunction(fetchDictionaryCollection)
    ? once(fetchDictionaryCollection)
    : undefined

  // 解析完成构建 Table 列配
  const resolvedTableColumns = ref([]) as Ref<
    Ref<InternalProTableColumnProps<Data>>[]
  >

  // 解析完成构建 ProSearch 列配置
  const resolvedSearchColumns = ref([]) as Ref<
    ProFormColumnOptions<Data, any, Collection>[]
  >

  // 解析完成构建 ProTable Editable 列配置
  const resolvedProTableEditableColumns = ref([]) as Ref<
    ProFormColumnOptions<Data, any, Collection>[]
  >

  // 监听列变化，解析列配置
  if (columns) {
    watch(
      toRef(columns),
      _columns => {
        resolvedTableColumns.value = []
        resolvedSearchColumns.value = []
        const { search, table, editable } = _columns.reduce(
          (prev, curr, i) => {
            // 构建 table column
            const tableColumnOptions = buildTableColumn(
              curr,
              i,
              fetchDictionaryCollectionOnce
            )
            // 将解析好的列存入最终结果中
            prev.table.push(tableColumnOptions)

            const { type, name } = toValue(tableColumnOptions)._column

            // 合并搜索列配置，type 和 dict 只能使用 table column 上的配置
            // 其余可以在 search 中单独配置
            const searchOptions = mergeWithTovalue(
              { label: curr.label, name: curr.name },
              toValue(curr.form),
              toValue(curr.search),
              { type }
            )

            // 合并编辑列配置，type、dict 和 name 只能使用 table column 上的配置
            // 其余可以在 editableForm 中单独配置
            const editableOptions = mergeWithTovalue(
              { label: curr.label },
              toValue(curr.form),
              toValue(curr.editableForm),
              {
                type,
                itemProps: { noStyle: true },
                name: ['table', TableEditableNamePlaceholder, name],
              }
            )

            // search 和 table 的 dict 要保持是同一个对象，不能被 merge 克隆
            if (curr.dict) {
              editableOptions.dict = searchOptions.dict = curr.dict
            }

            prev.search.push(searchOptions)
            prev.editable.push(editableOptions)

            return prev
          },
          {
            search: [],
            table: [],
            editable: [],
          } as {
            search: ProFormColumnOptions<Data, any, Collection>[]
            editable: ProFormColumnOptions<Data, any, Collection>[]
            table: Ref<InternalProTableColumnProps<Data>>[]
          }
        )

        resolvedTableColumns.value = table
        resolvedSearchColumns.value = search
        resolvedProTableEditableColumns.value = editable
      },
      { immediate: true, deep: true }
    )
  }

  ctx.columns = {
    table: resolvedTableColumns,
    search: resolvedSearchColumns,
    editable: resolvedProTableEditableColumns,
  }
}
