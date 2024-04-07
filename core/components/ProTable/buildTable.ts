import { MaybeRef, toRef } from '@vueuse/core'
import { toValue } from '@vueuse/core'
import { once } from 'lodash-es'
import { computed, isRef, nextTick, ref, watch, watchEffect } from 'vue'

import { buildDefaultToolbar } from './constant'

import { fetchWithLoding, mergeWithTovalue, resolveRef } from '../common'
import { buildButtonGroup } from '../ProButton'
import { buildForm } from '../ProForm'

import { isArray, isFunction, isPlainObject } from '~/utils'

import type {
  BuildProTableOptionResult,
  BuildTableBinding,
  BuildTableResult,
  FetchProTablePageListResult,
  InternalProTableColumnProps,
  ProTableScope,
  ProTableToolbarActions,
} from './interface'
import type {
  DataObject,
  DeepMaybeRefOrGetter,
  ToDeepMaybeRefOrGetter,
} from '../common'
import type { BuildFormBinding, BuildFormOptionResult } from '../ProForm'
import type { MaybeRefOrGetter } from '@vueuse/core'
import type {
  PaginationProps,
  TablePaginationConfig,
  TableProps,
} from 'ant-design-vue'
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
  const scope: ProTableScope<Data> = {
    reload,
    reset,
    previous,
    next,
  }

  const {
    data,
    defaultData,
    immediate = true,
    tableProps,
    params,
    columns,
    search,
    action,
    toolbar,
    fetchDictionaryCollection,
    fetchTableData,
    onDataSourceChange,
    onLoad,
    onLoadingChange,
    onRequestError,
  } = options(scope)

  // 当前页
  const currentPage = ref(1)
  // 每页数据数量
  const currentPageSize = ref(10)
  // 实际的数据集合
  const resolvedData = ref(defaultData ?? []) as Ref<Data[]>
  // 请求 loading
  const loading = ref(false)
  // 搜索表单配置
  let proFormBinding: BuildTableBinding<Data, SearchForm>['proFormBinding'] =
    false

  // 解析 Table Props
  const resolvedTableProps = computed<TableProps<Data>>(() => {
    const propsValue = mergeWithTovalue<TableProps<Data>>(
      {},
      toValue(tableProps)
    )

    if (propsValue.pagination !== false) {
      propsValue.pagination = {
        'onUpdate:current'(pageNum) {
          _fetchTableData(pageNum)
        },
        'onUpdate:pageSize'(pageSize) {
          _fetchTableData(pageSize)
        },
        current: currentPage.value,
        pageSize: currentPageSize.value,
        ...propsValue.pagination,
      }
    }

    return propsValue
  })

  // 解析 toolbar
  const resolvedToolbar = buildButtonGroup<ProTableToolbarActions, {}>(
    toolbar,
    buildDefaultToolbar(scope)
  )

  // 只调用一次的获取集合函数
  const fetchDictionaryCollectionOnce = isFunction(fetchDictionaryCollection)
    ? once(fetchDictionaryCollection)
    : undefined

  // 构建列
  const resolvedColumns = ref([]) as Ref<
    Ref<InternalProTableColumnProps<Data>>[]
  >
  // const resolvedColumnsMap = new Map<
  //   NamePath,
  //   InternalProFormColumnOptions<T>
  // >()

  if (columns) {
    watch(toRef(columns), _columns => {
      resolvedColumns.value = []
      for (const c of toValue(_columns)) {
        buildTableColumn
      }
    })
  }

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

  // 如果 search 是 ref 则监听其变化
  if (isRef(search)) {
    watch(
      search,
      _search => {
        proFormBinding = !_search
          ? _search
          : buildForm(() => _search).proFormBinding
      },
      { immediate: true }
    )
  } else if (search) {
    const res = buildForm<SearchForm, SearchFormSubmit>(scope => {
      if (isFunction(search)) {
        const res = search(scope)
        if (res === false) {
          proFormBinding = false
          return {}
        }
        return res
      }
      return search
    })

    proFormBinding = res.proFormBinding
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
  async function _fetchTableData(pageSize?: number, pageNum?: number) {
    fetchWithLoding(
      loading,
      () => {
        let res:
          | Data[]
          | FetchProTablePageListResult<Data>
          | Promise<Data[] | FetchProTablePageListResult<Data>>

        if (isFunction(fetchTableData)) {
          const { pagination } = toValue(resolvedTableProps)
          const page =
            pagination !== false
              ? {
                  pageNum: (pageNum = pageNum ?? pagination!.current!),
                  pageSize: (pageSize = pageSize ?? pagination!.pageSize!),
                }
              : undefined
          res = fetchTableData({
            page,
            params: toValue(params),
          })
        } else {
          res = toValue(data) ?? []
        }

        return res
      },
      res => {
        if (isPaginationData(res)) {
          resolvedData.value = res.data
        } else {
          resolvedData.value = res
        }

        if (isFunction(onLoad)) {
          onLoad(resolvedData.value)
        }
      },
      onRequestError,
      () => {
        pageNum && (currentPage.value = pageNum)
        pageSize && (currentPageSize.value = pageSize)
      }
    )
  }

  // 如果 data 是
  if (isRef(data) || isRef(params)) {
    watch(
      [data, params],
      () => {
        _fetchTableData()
      },
      { immediate: true }
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
      toolbar: resolvedToolbar,
      proFormBinding: proFormBinding,
    },
  }
}
