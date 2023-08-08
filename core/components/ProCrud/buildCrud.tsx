import { Plus } from '@element-plus/icons-vue'
import { merge } from 'lodash-es'
import { computed, provide, ref } from 'vue'

import { compose } from './compose'
import {
  AddFormRef,
  DefaultShow,
  EditFormRef,
  ProSearchRef,
  ProTableRef,
  ViewFormRef,
} from './constant'
import { useDialog } from './useDialog'
import { useOperate } from './useOperate'

import { unRef } from '../common'
import {
  buildForm,
  type ButtonsOption,
  type ProFormColumnOptions,
} from '../ProForm'
import { buildSearch } from '../ProSearch'
import { buildTable } from '../ProTable'

import type { Middleware } from './compose'
import type {
  BuildCrudBinding,
  BuildCrudContext,
  BuildCrudOptionReturn,
  BuildCrudReturn,
  ProCrudColumnOption,
  ProCrudInstance,
  ProCrudScope,
} from './interface'
import type {
  FetchTableDataResult,
  FetchTableListQuery,
  ProTableColumnProps,
  ProTableToolbarOption,
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

  const context = {
    scope: {},
    binding: {},
    dialog: {},
    originCtx: ctx,
    options,
  } as BuildCrudContext

  compose<BuildCrudContext>([
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
  } = context

  const proCrudBinding: BuildCrudBinding<T, S, F, R> = {
    searchShow,
    searchBinding,
    tableShow,
    tableBinding,
    addFormShow,
    addFormBinding,
    addFormDialog,
    editFormShow,
    editFormBinding,
    editFormDialog,
    viewFormShow,
    viewFormBinding,
    viewFormDialog,
  }

  // @ts-ignore
  return { proCrudRef, proCrudBinding }
}

const buildSearchMiddlewre: Middleware<BuildCrudContext> = (ctx, next) => {
  const { proSearchBinding, proSearchRef } = buildSearch(scope => {
    ctx.scope.search = scope

    next()

    const {
      show: _,
      buttons: customButtons,
      ...rest
    } = ctx.optionResult.search || {}

    const buttons = merge<ButtonsOption, ButtonsOption | undefined>(
      {
        list: {
          confirm: {
            props: {
              onClick() {
                ctx.scope.table.reload()
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
      customButtons
    )

    return {
      columns: ctx.columns.search.map<ProFormColumnOptions<any>>(column => ({
        label: column.label,
        prop: column.prop,
        ...column.search,
      })),
      buttons,
      ...rest,
    }
  })

  ctx.binding.search = proSearchBinding
  provide(ProSearchRef, proSearchRef)
}

const buildTableMiddleware: Middleware<BuildCrudContext> = (ctx, next) => {
  const { proTableBinding, proTableRef } = buildTable(scope => {
    ctx.scope.table = scope

    next()

    const operateColumn = useOperate(ctx)

    const { show: _, toolbar, ...rest } = ctx.optionResult.table || {}
    return {
      toolbar: merge<ProTableToolbarOption, ProTableToolbarOption | undefined>(
        {
          list: {
            add: {
              show: true,
              tooltip: { content: '添加' },
              props: {
                icon: Plus,
                onClick: ctx.scope.addForm.showDialog,
              },
            },
          },
        },
        toolbar
      ),
      ...rest,
      columns: ctx.columns.table
        .map<ProTableColumnProps<any>>(column => ({
          label: column.label,
          prop: column.prop,
          ...column.table,
        }))
        .concat(operateColumn),

      request: {
        fetchTableData,
      },
    }
  })

  /**
   * 获取数据
   */
  async function fetchTableData(
    query: FetchTableListQuery
  ): Promise<FetchTableDataResult<any>> {
    const {
      scope: { search },
      optionResult: { request },
    } = ctx
    const form = search.getFormValues()
    const params = { query, form }
    const transformInput = request?.transformQuery?.(params) ?? params

    const response = (await request?.fetchPaginationData?.(
      transformInput
    )) as any

    const transformOutput = (request?.transformResponse?.({
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

const buildAddFormMiddleware: Middleware<BuildCrudContext> = (ctx, next) => {
  const { proFormBinding, proFormRef } = buildForm(scope => {
    const { showDialog, hideDialog, merged } = useDialog(scope)

    ctx.scope.addForm = {
      ...scope,
      showDialog,
      hideDialog,
    }

    next()

    ctx.dialog.addForm = merged({
      title: '添加',
      appendToBody: true,
      ...ctx.optionResult.addFormDialog,
    })

    const columns = ctx.columns.addForm.map(column => ({
      label: column.label,
      prop: column.prop,
      ...column.addForm,
    }))

    return {
      col: { span: 12 },
      buttons: {
        show: false,
        list: {
          cancel: {
            text: '取消',
            show: true,
            props: { onClick: hideDialog },
          },
        },
      },
      ...(ctx.optionResult.addForm ?? {}),
      columns,
      request: {
        submitRequest: ctx.optionResult.request?.addRequest,
        successRequest() {
          hideDialog()
          ctx.scope.table.reload()
        },
      },
    }
  })

  ctx.binding.addForm = proFormBinding

  provide(AddFormRef, proFormRef)
}

const buildEditFormMiddleware: Middleware<BuildCrudContext> = (ctx, next) => {
  const { proFormBinding, proFormRef } = buildForm(scope => {
    const { showDialog, hideDialog, merged } = useDialog(scope)

    ctx.scope.editForm = {
      ...scope,
      showDialog,
      hideDialog,
    }

    next()

    ctx.dialog.editForm = merged({
      title: '编辑',
      appendToBody: true,
      ...ctx.optionResult.editFormDialog,
    })

    const columns = ctx.columns.editForm.map(column => ({
      label: column.label,
      prop: column.prop,
      ...column.editForm,
    }))

    return {
      col: { span: 12 },
      buttons: {
        show: false,
        list: {
          cancel: {
            text: '取消',
            show: true,
            props: { onClick: hideDialog },
          },
        },
      },
      ...(ctx.optionResult.editForm ?? {}),
      columns,
      request: {
        submitRequest: ctx.optionResult.request?.editRequest,
        successRequest() {
          hideDialog()
          ctx.scope.table.reload()
        },
      },
    }
  })

  ctx.binding.editForm = proFormBinding
  provide(EditFormRef, proFormRef)
}

const buildViewFormMiddleware: Middleware<BuildCrudContext> = (ctx, next) => {
  const { proFormBinding, proFormRef } = buildForm(scope => {
    const { showDialog, hideDialog, merged } = useDialog(scope)

    ctx.scope.viewForm = {
      ...scope,
      showDialog,
      hideDialog,
    }

    next()

    ctx.dialog.viewForm = merged({
      title: '查看',
      appendToBody: true,
      ...ctx.optionResult.viewFormDialog,
    })

    const columns = ctx.columns.viewForm.map(column => ({
      label: column.label,
      prop: column.prop,
      ...column.viewForm,
    }))

    return {
      col: { span: 12 },
      buttons: {
        show: false,
        list: {
          confirm: {
            text: '取消',
            props: {
              type: 'default',
              onClick: hideDialog,
            },
          },
        },
      },
      ...(ctx.optionResult.viewForm ?? {}),
      formProps: { ...ctx.optionResult.viewForm?.formProps, disabled: true },
      columns,
    }
  })

  ctx.binding.viewForm = proFormBinding
  provide(ViewFormRef, proFormRef)
}

const buildBasicMiddleware: Middleware<BuildCrudContext> = (ctx, next) => {
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

  ctx.columns = normalizeColumns(optionResult.columns)

  ctx.show = normalizeShow(optionResult)

  next()
}

function normalizeColumns(columns: ProCrudColumnOption<any>[] | undefined) {
  const initialColumns: BuildCrudContext['columns'] = {
    table: [],
    search: [],
    addForm: [],
    editForm: [],
    viewForm: [],
  }

  const result =
    columns?.reduce((prev, curr) => {
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
  optionResult: BuildCrudOptionReturn<any, any, any, any>
) {
  return (
    ['search', 'table', 'addForm', 'editForm', 'viewForm'] as const
  ).reduce<BuildCrudContext['show']>((prev, type) => {
    prev[type] = computed(() =>
      unRef(optionResult[type]?.show ?? DefaultShow.show)
    )
    return prev
  }, {} as any)
}
