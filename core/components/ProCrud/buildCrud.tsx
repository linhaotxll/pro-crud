import { PlusOutlined } from '@ant-design/icons-vue'
import { merge } from 'lodash-es'
import { computed, h, inject, provide, ref, toValue } from 'vue'

import { compose } from './compose'
import {
  AddFormRef,
  DefaultAddFormToast,
  DefaultCrudForm,
  DefaultDialogOption,
  DefaultEditFormToast,
  DefaultShow,
  EditFormRef,
  ProSearchRef,
  ProTableRef,
  ViewFormRef,
} from './constant'
import {
  type BuildCrudBinding,
  type BuildCrudContext,
  type BuildCrudOptionReturn,
  type BuildCrudReturn,
  type CrudFormOptionResult,
  type ProCrudInstance,
  type ProCrudScope,
} from './interface'
import { useDialog } from './useDialog'
import { useOperate } from './useOperate'

import { processDictionary, unRef } from '../common'
import { buildForm, type ProFormColumnOptions } from '../ProForm'
import { buildSearch } from '../ProSearch'
import { buildTable } from '../ProTable'
import { showToast } from '../Toast'

import { GlobalOption } from '~/interface'

import type { Middleware } from './compose'
import type {
  CrudDialogOption,
  CrudFormOption,
  SearchAction,
} from './interface'
import type { ActionsOption } from '../ProButton'
import type { BuildFormOptionResult } from '../ProForm'
import type {
  FetchTableDataResult,
  FetchTableListQuery,
  ProTableColumnProps,
  ProTableToolbarOption,
} from '../ProTable'
import type { ProComponentsOptions } from '~/interface'

export function buildCrud<
  T extends object = any,
  R extends object = any,
  S extends object = any,
  S1 extends object = any,
  A extends object = any,
  E extends object = any
>(
  options: (
    scope: ProCrudScope<T, S, A, E>,
    ctx?: undefined
  ) => BuildCrudOptionReturn<T, R, S, S1, A, E>
): BuildCrudReturn<T, S, A, E>

export function buildCrud<
  C extends object,
  R extends object,
  T extends object,
  S extends object,
  S1 extends object,
  A extends object,
  E extends object
>(
  options: (
    scope: ProCrudScope<T, S, A, E>,
    ctx: C
  ) => BuildCrudOptionReturn<T, R, S, S1, A, E>,
  context: C
): BuildCrudReturn<T, S, A, E>

export function buildCrud<
  C extends object,
  T extends object,
  R extends object,
  S extends object,
  S1 extends object,
  A extends object,
  E extends object
>(
  options: (
    scope: ProCrudScope<T, S, A, E>,
    ctx?: C
  ) => BuildCrudOptionReturn<T, R, S, S1, A, E>,
  ctx?: C
): BuildCrudReturn<T, S, A, E> {
  const proCrudRef = ref<ProCrudInstance | null>(null)

  const context = {
    scope: {},
    binding: {},
    dialog: {},
    originCtx: ctx,
    modalType: ref(),
    options,
  } as BuildCrudContext<T, R, S, S1, A, E>

  // debugger
  compose<BuildCrudContext<T, R, S, S1, A, E>>([
    buildSearchMiddlewre,
    buildTableMiddleware,
    buildAddFormMiddleware,
    buildEditFormMiddleware,
    buildViewFormMiddleware,
    buildBasicMiddleware,
  ])(context)

  const {
    show: {
      search: searchShow,
      table: tableShow,
      addForm: addFormShow,
      editForm: editFormShow,
      viewForm: viewFormShow,
    },
    binding: {
      search: searchBinding,
      table: tableBinding,
      addForm: addFormBinding,
      editForm: editFormBinding,
      viewForm: viewFormBinding,
    },
    dialog: {
      addForm: addFormDialog,
      editForm: editFormDialog,
      viewForm: viewFormDialog,
    },
    optionResult: { deleteToast, addToast, editToast },
  } = context

  const modalShow = computed(() => {
    return addFormShow.value || editFormShow.value || viewFormShow.value
  })

  const modalProps = computed<CrudDialogOption | undefined>(() => {
    const modalType = context.modalType.value
    if (!modalType) return

    if (modalType === 'add') return addFormDialog.value
    if (modalType === 'edit') return editFormDialog.value
    if (modalType === 'view') return viewFormDialog.value

    return undefined
  })

  const modalFormProps = computed(() => {
    const modalType = context.modalType.value
    if (!modalType) return undefined

    if (modalType === 'add') return addFormBinding
    if (modalType === 'edit') return editFormBinding
    if (modalType === 'view') return viewFormBinding

    return undefined
  })

  const proCrudBinding: BuildCrudBinding<T, S, A, E> = {
    searchShow,
    searchBinding,
    tableShow,
    tableBinding,
    modalType: context.modalType,
    modalShow,
    modalProps,
    modalFormProps,
    deleteToast,
    addToast,
    editToast,
  }

  inject(GlobalOption)?.hooks?.crud?.({
    proCrudScope: context.scope,
    proCrudBinding,
  })

  // @ts-ignore
  return { proCrudRef, proCrudBinding }
}

const buildSearchMiddlewre: Middleware<
  BuildCrudContext<any, any, any, any, any, any>
> = (ctx, next) => {
  const { proSearchBinding, proSearchRef } = buildSearch(scope => {
    ctx.scope.search = scope

    next()

    const {
      show: _,
      actions: customActions,
      ...rest
    } = ctx.optionResult.search || {}

    const actions = merge<
      ActionsOption<SearchAction>,
      ActionsOption<SearchAction> | undefined
    >(
      {
        list: {
          confirm: {
            props: {
              onClick() {
                // 提交表单，crud search 的 confirm 成功后会自动刷新 Table
                return ctx.scope.search.submit()
              },
            },
          },

          reset: {
            props: {
              onClick() {
                ctx.scope.search.reset()
                if (ctx.optionResult.autoReload) {
                  ctx.scope.table.reload()
                }
              },
            },
          },
        },
      },
      customActions
    )

    const columns = ctx.columns.search.map<ProFormColumnOptions<any>>(
      column => ({
        ...column,
        ...column.search,
      })
    )

    return merge({}, rest, {
      columns,
      actions,
      toast: false,
      submitRequest(values: any) {
        return ctx.scope.table.reload(values)
      },
    })
  })

  ctx.binding.search = proSearchBinding
  provide(ProSearchRef, proSearchRef)
}

const buildTableMiddleware: Middleware<
  BuildCrudContext<any, any, any, any, any, any>
> = (ctx, next) => {
  const { proTableBinding, proTableRef } = buildTable(scope => {
    ctx.scope.table = scope

    next()

    const actionColumn = useOperate(ctx)

    const { show: _, toolbar, ...rest } = ctx.optionResult.table || {}
    return {
      fetchDictCollection: ctx.optionResult.fetchDictCollection,
      toolbar: merge<ProTableToolbarOption, ProTableToolbarOption | undefined>(
        {
          actions: {
            add: {
              show: ctx.show.addForm,
              tooltip: { title: '添加' },
              props: {
                icon: h(PlusOutlined),
                onClick: ctx.scope.addForm.showDialog,
              },
            },
          },
        },
        toolbar
      ),
      ...rest,
      action: actionColumn,
      columns: ctx.columns.table.map<ProTableColumnProps<any>>(column => ({
        label: column.label,
        name: column.name,
        dict: column.dict,
        type: column.type,
        ...column.table,
      })),

      fetchTableData,
    }
  })

  let globalOption: ProComponentsOptions | undefined
  const transformQuery =
    ctx.optionResult.transformQuery ?? ensureGlobalOption()?.transformQuery
  const transformResponse =
    ctx.optionResult.transformResponse ??
    ensureGlobalOption()?.transformResponse

  function ensureGlobalOption() {
    return globalOption ? globalOption : (globalOption = inject(GlobalOption))
  }

  /**
   * 获取数据
   */
  async function fetchTableData(
    query: FetchTableListQuery<any, any>
  ): Promise<FetchTableDataResult<any>> {
    const {
      scope: { search },
      optionResult: { fetchPaginationData },
    } = ctx
    const form = search.getFormValues()
    const params = { query, form }

    const transformInput = transformQuery?.(params) ?? params

    const response = (await fetchPaginationData?.(transformInput)) as any

    const transformOutput = (transformResponse?.({
      query: transformInput,
      response,
    }) ?? response) as FetchTableDataResult<any>

    return {
      data: transformOutput.data,
      total: transformOutput.total,
    }
  }

  ctx.binding.table = proTableBinding
  provide(ProTableRef, proTableRef)
}

const buildAddFormMiddleware: Middleware<
  BuildCrudContext<any, any, any, any, any, any>
> = (ctx, next) => {
  const { proFormBinding, proFormRef } = buildForm(scope => {
    const {
      showDialog: _showDialog,
      hideDialog,
      merged,
      clear,
    } = useDialog(scope)

    function showDialog(values: object | undefined) {
      _showDialog(values)
      ctx.modalType.value = 'add'
      ctx.scope.editForm.clear()
      ctx.scope.viewForm.clear()
    }

    ctx.scope.addForm = {
      ...scope,
      showDialog,
      hideDialog,
      clear,
    }

    next()

    ctx.dialog.addForm = computed<CrudDialogOption>(() => {
      const mergedProps = merge<
        CrudDialogOption,
        CrudDialogOption,
        CrudDialogOption | undefined,
        CrudDialogOption | undefined,
        CrudDialogOption | undefined
      >(
        { ...DefaultDialogOption },
        { props: { title: '新增', onCancel: hideDialog } },
        inject(GlobalOption)?.dialog,
        ctx.optionResult.dialog,
        ctx.optionResult.addFormDialog
      )

      mergedProps.props = merged(mergedProps.props)

      return mergedProps
    })

    const columns = ctx.columns.addForm.map<ProFormColumnOptions<any>>(
      column => ({
        ...column,
        ...column.form,
        ...column.addForm,
      })
    )

    return merge<
      CrudFormOptionResult,
      CrudFormOptionResult,
      CrudFormOption | undefined,
      CrudFormOptionResult | undefined,
      BuildFormOptionResult<any>
    >(
      {
        ...DefaultCrudForm,
        fetchDictCollection: ctx.optionResult.fetchDictCollection,
      },
      {
        formProps: { disabled: false },
        actions: {
          show: false,
          list: {
            cancel: {
              text: '取消',
              show: true,
              props: { onClick: hideDialog },
            },
            confirm: {
              show: true,
              props: { onClick: scope.submit },
            },
          },
        },
      },
      ctx.optionResult.form,
      ctx.optionResult.addForm,
      {
        columns,
        submitRequest: ctx.optionResult.addRequest,
        successRequest() {
          hideDialog()
          showToast(ctx.optionResult.addToast, DefaultAddFormToast)
          ctx.scope.table.reload()
        },
      }
    )
  })

  ctx.binding.addForm = proFormBinding

  provide(AddFormRef, proFormRef)
}

const buildEditFormMiddleware: Middleware<
  BuildCrudContext<any, any, any, any, any, any>
> = (ctx, next) => {
  const { proFormBinding, proFormRef } = buildForm(scope => {
    const {
      showDialog: _showDialog,
      hideDialog,
      merged,
      clear,
    } = useDialog(scope)

    function showDialog(values: object | undefined) {
      _showDialog(values)
      ctx.modalType.value = 'edit'
      ctx.scope.addForm.clear()
      ctx.scope.viewForm.clear()
    }

    ctx.scope.editForm = {
      ...scope,
      showDialog,
      hideDialog,
      clear,
    }

    next()

    ctx.dialog.editForm = computed<CrudDialogOption>(() => {
      const mergedProps = merge<
        CrudDialogOption,
        CrudDialogOption,
        CrudDialogOption | undefined,
        CrudDialogOption | undefined,
        CrudDialogOption | undefined
      >(
        { ...DefaultDialogOption },
        { props: { title: '编辑', onCancel: hideDialog } },
        inject(GlobalOption)?.dialog,
        ctx.optionResult.dialog,
        ctx.optionResult.editFormDialog
      )

      mergedProps.props = merged(mergedProps.props)

      return mergedProps
    })

    const columns = ctx.columns.editForm.map<ProFormColumnOptions<any>>(
      column => ({
        ...column,
        ...column.form,
        ...column.editForm,
      })
    )

    return merge<
      CrudFormOptionResult,
      CrudFormOptionResult,
      CrudFormOption | undefined,
      CrudFormOptionResult | undefined,
      BuildFormOptionResult<any>
    >(
      {
        ...DefaultCrudForm,
        fetchDictCollection: ctx.optionResult.fetchDictCollection,
      },
      {
        formProps: { disabled: false },
        actions: {
          show: false,
          list: {
            cancel: {
              text: '取消',
              show: true,
              props: { onClick: hideDialog },
            },
            confirm: {
              show: true,
              props: { onClick: scope.submit },
            },
          },
        },
      },
      ctx.optionResult.form,
      ctx.optionResult.editForm,
      {
        columns,
        submitRequest: ctx.optionResult.editRequest,
        successRequest() {
          hideDialog()
          showToast(ctx.optionResult.editToast, DefaultEditFormToast)
          ctx.scope.table.reload()
        },
      }
    )
  })

  ctx.binding.editForm = proFormBinding
  provide(EditFormRef, proFormRef)
}

const buildViewFormMiddleware: Middleware<
  BuildCrudContext<any, any, any, any, any, any>
> = (ctx, next) => {
  const { proFormBinding, proFormRef } = buildForm(scope => {
    const {
      showDialog: _showDialog,
      hideDialog,
      merged,
      clear,
    } = useDialog(scope)

    function showDialog(values: object | undefined) {
      _showDialog(values)
      ctx.modalType.value = 'view'
      ctx.scope.addForm.clear()
      ctx.scope.editForm.clear()
    }

    ctx.scope.viewForm = {
      ...scope,
      showDialog,
      hideDialog,
      clear,
    }

    next()

    ctx.dialog.viewForm = computed<CrudDialogOption>(() => {
      const mergedProps = merge<
        CrudDialogOption,
        CrudDialogOption,
        CrudDialogOption | undefined,
        CrudDialogOption | undefined,
        CrudDialogOption | undefined
      >(
        { ...DefaultDialogOption },
        { props: { title: '查看', onCancel: hideDialog } },
        inject(GlobalOption)?.dialog,
        ctx.optionResult.dialog,
        ctx.optionResult.viewFormDialog
      )

      mergedProps.props = merged(mergedProps.props)

      return mergedProps
    })

    const columns = ctx.columns.viewForm.map<ProFormColumnOptions<any>>(
      column => ({
        ...column,
        ...column.form,
        ...column.viewForm,
      })
    )

    return merge<
      CrudFormOptionResult,
      CrudFormOption | undefined,
      CrudFormOption | undefined,
      CrudFormOptionResult | undefined,
      BuildFormOptionResult<any>
    >(
      {
        ...DefaultCrudForm,
        fetchDictCollection: ctx.optionResult.fetchDictCollection,
      },
      {
        formProps: { disabled: true },
        actions: {
          show: false,
          list: {
            cancel: {
              text: '关闭',
              show: true,
              props: { onClick: hideDialog },
            },
            confirm: { show: false },
          },
        },
      },
      ctx.optionResult.form,
      ctx.optionResult.viewForm,
      {
        columns,
      }
    )
  })

  ctx.binding.viewForm = proFormBinding
  provide(ViewFormRef, proFormRef)
}

const buildBasicMiddleware: Middleware<
  BuildCrudContext<any, any, any, any, any, any>
> = (ctx, next) => {
  const {
    scope: { search, table, addForm, editForm, viewForm },
  } = ctx

  const optionResult = (ctx.optionResult = ctx.options(
    {
      search,
      addForm,
      editForm,
      viewForm,
      table,
    },
    ctx.originCtx
  ))

  ctx.optionResult.autoReload ??= true

  ctx.columns = normalizeColumns(optionResult)

  ctx.show = normalizeShow(optionResult)

  next()
}

function normalizeColumns(
  options: BuildCrudOptionReturn<any, any, any, any, any, any>
) {
  const { columns, fetchDictCollection } = options
  const initialColumns: BuildCrudContext<
    any,
    any,
    any,
    any,
    any,
    any
  >['columns'] = {
    table: [],
    search: [],
    addForm: [],
    editForm: [],
    viewForm: [],
  }

  const resolveDictionary = processDictionary(fetchDictCollection)
  resolveDictionary.resolved = true

  // 重写获取集合的方法，下透到 Form 和 Table 不会再次解析
  // @ts-ignore
  options.fetchDictCollection = resolveDictionary

  const result =
    columns?.reduce((prev, curr) => {
      // 将已经解析好的 dict 赋值给 column，下透到 ProForm、ProTable 组件不会再进行二次解析
      if (curr.dict) {
        const visible = computed(() => {
          const visibles = [
            toValue(curr.search?.show),
            toValue(curr.table?.show),
            toValue(curr.addForm?.show),
            toValue(curr.editForm?.show),
            toValue(curr.viewForm?.show),
          ].filter(item => item != null)

          // 如果为空，则应该展示
          // 如果全是 false 则不展示
          // 否则都展示

          if (!visibles.length) {
            return true
          }

          if (visibles.every(item => item)) {
            return false
          }

          return true
        })
        // @ts-ignore
        curr.dict = resolveDictionary({ ...curr, show: visible })
      }

      if (!(curr.search?.show === false)) {
        prev.search.push(curr)
      }
      if (!(curr.table?.show === false)) {
        prev.table.push(curr)
      }
      if (!(curr.addForm?.show === false)) {
        prev.addForm.push(curr)
      }
      if (!(curr.editForm?.show === false)) {
        prev.editForm.push(curr)
      }
      if (!(curr.viewForm?.show === false)) {
        prev.viewForm.push(curr)
      }

      return prev
    }, initialColumns) ?? initialColumns

  return result
}

function normalizeShow(
  optionResult: BuildCrudOptionReturn<any, any, any, any, any, any>
) {
  return (
    ['search', 'table', 'addForm', 'editForm', 'viewForm'] as const
  ).reduce<BuildCrudContext<any, any, any, any, any, any>['show']>(
    (prev, type) => {
      prev[type] = computed(() =>
        unRef(optionResult[type]?.show ?? DefaultShow.show)
      )
      return prev
    },
    {} as any
  )
}
