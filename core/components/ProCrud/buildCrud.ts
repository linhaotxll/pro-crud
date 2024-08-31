import { computed, nextTick, ref, toValue, watchEffect } from 'vue'

import {
  buildDefaultCrudOptions,
  buildDefaultModalBeforeSubmit,
  buildDefaultModalSubmitRequest,
  buildDefaultModalSubmitter,
  buildDefaultModalValidateFail,
  defaultModalProps,
} from './constant'
import { type BuildCrudOptionReturn, type ProCrudScope } from './interface'
import { ModalType } from './interface'

import {
  compose,
  markIgnoreMerge,
  mergeWithNoUnref,
  mergeWithTovalue,
  type DataObject,
  type NextMiddleware,
} from '../common'
import { buildModalForm } from '../ModalForm'
import { buildTable } from '../ProTable'

import { getGlobalOptions } from '~/constant'
import { isNil } from '~/utils'

import type {
  BuildCrudContext,
  BuildCrudResult,
  ProCrudColumnOption,
  ProCrudModalFormOptions,
  ProCrudModalScope,
} from './interface'
import type { BuildModalFormOptionReturn } from '../ModalForm'
import type { ProFormColumnOptions } from '../ProForm'
import type { FormProps } from 'ant-design-vue'
import type { Ref } from 'vue'

export function buildCrud<
  Data extends DataObject = DataObject,
  ModalForm = Data,
  Collection = any
>(
  options: (
    scope: ProCrudScope<Data>
  ) => BuildCrudOptionReturn<Data, ModalForm, Collection>
): BuildCrudResult<Data> {
  const context: BuildCrudContext<Data, ModalForm, Collection> = {
    options,
    optionResult: null!,
    scope: {
      table: null!,
      search: null!,
      modal: null!,
    },
    modalColumns: {
      add: [],
      edit: [],
      view: [],
    },
    tableBinding: null!,
    modalFormBinding: null!,
  }

  compose<BuildCrudContext>([
    buildTableMiddleware,
    buildModalFormMiddleware,
    buildBasicMiddleware,
  ])(context)

  return {
    proCrudBinding: {
      tableBinding: context.tableBinding,
      modalFormBinding: context.modalFormBinding,
    },
  }
}

function buildTableMiddleware(ctx: BuildCrudContext, next: NextMiddleware) {
  // @ts-ignore
  const { proTableBinding } = buildTable(tableScope => {
    ctx.scope.table = tableScope.table
    ctx.scope.search = tableScope.search

    next()

    // return {}
    return ctx.optionResult
  })

  ctx.tableBinding = proTableBinding
}

/**
 * 不同弹窗传递的 Form Props
 */
const topLevelFormPropsWithModalType: Record<ModalType, FormProps | undefined> =
  {
    [ModalType.Add]: undefined,
    [ModalType.Edit]: undefined,
    [ModalType.View]: { disabled: true },
  }

function buildModalFormMiddleware(ctx: BuildCrudContext, next: NextMiddleware) {
  const modalType = ref<ModalType>()

  // @ts-ignore
  const { modalFormBinding } = buildModalForm(scope => {
    const { showModal, ...rest } = scope

    function showModalWithType(type: ModalType, record?: any) {
      modalType.value = type
      if (record) {
        scope.setFieldValues(record)
        nextTick(() => {
          scope.setFieldValues(record)
        })
      }

      showModal()
    }

    ctx.scope.modal = {
      ...rest,
      showAddModal() {
        showModalWithType(ModalType.Add)
      },
      showEditModal(record) {
        showModalWithType(ModalType.Edit, record)
      },
      showViewModal(record) {
        showModalWithType(ModalType.View, record)
      },
    } as ProCrudModalScope

    next()

    const {
      modalProps,
      submitter,
      form,
      columns,
      addForm,
      editForm,
      viewForm,
      fetchDictionaryCollection,
    } = ctx.optionResult

    const addFormColumns = ref([]) as Ref<ProFormColumnOptions[]>
    const editFormColumns = ref([]) as Ref<ProFormColumnOptions[]>
    const viewFormColumns = ref([]) as Ref<ProFormColumnOptions[]>

    const formColumsMap: Record<ModalType, Ref<ProFormColumnOptions[]>> = {
      [ModalType.Add]: addFormColumns,
      [ModalType.Edit]: editFormColumns,
      [ModalType.View]: viewFormColumns,
    }

    const formMap: Record<ModalType, ProCrudModalFormOptions | undefined> = {
      [ModalType.Add]: addForm,
      [ModalType.Edit]: editForm,
      [ModalType.View]: viewForm,
    }

    watchEffect(() => {
      const result: {
        add: ProFormColumnOptions[]
        edit: ProFormColumnOptions[]
        view: ProFormColumnOptions[]
      } = { add: [], edit: [], view: [] }

      const { add, edit, view } =
        columns?.reduce((prev, column) => {
          const { dict } = column
          const target: ProCrudColumnOption = {
            label: column.label,
            name: column.name,
          }
          if (column.type) {
            target.type = column.type
          }

          // 新增表单列
          prev.add.push(
            mergeWithNoUnref(
              { dict },
              target,
              toValue(column.form),
              toValue(column.addForm)
            )
          )

          // 编辑表单列
          prev.edit.push(
            mergeWithNoUnref(
              { dict },
              target,
              toValue(column.form),
              toValue(column.editForm)
            )
          )

          // 查看表单列
          prev.view.push(
            mergeWithNoUnref(
              { dict },
              target,
              toValue(column.form),
              toValue(column.viewForm)
            )
          )

          return prev
        }, result) ?? result

      addFormColumns.value = add
      editFormColumns.value = edit
      viewFormColumns.value = view
    })

    // debugger
    // const keys = Object.keys(form ?? {})

    const resolvedModalProps = computed(() => {
      const type = modalType.value
      return isNil(type)
        ? {}
        : mergeWithTovalue({}, defaultModalProps[type], toValue(modalProps))
    })

    const resolvedSubmitter = computed(() => {
      const type = modalType.value
      return isNil(type)
        ? undefined
        : mergeWithTovalue(
            {},
            buildDefaultModalSubmitter()[type],
            toValue(submitter)
          )
    })

    const keys = ['row', 'col', 'labelCol', 'wrapperCol'] as const

    const commonFormOptions: BuildModalFormOptionReturn['form'] = {
      fetchDictionaryCollection,
      columns: computed(() => {
        const type = modalType.value
        return !isNil(type) ? formColumsMap[type].value : []
      }),
      formProps: computed(() => {
        const type = modalType.value
        return isNil(type)
          ? {}
          : mergeWithTovalue(
              {},
              toValue(form?.formProps),
              toValue(formMap[type]?.formProps),
              topLevelFormPropsWithModalType[type]
            )
      }),
      validateFail: computed(() => {
        const type = modalType.value
        return !isNil(type)
          ? buildDefaultModalValidateFail(ctx)?.[type]
          : undefined
      }),

      beforeSubmit: computed(() => {
        const type = modalType.value
        return !isNil(type)
          ? buildDefaultModalBeforeSubmit(ctx)?.[type]
          : undefined
      }),
      submitRequest: computed(() => {
        const type = modalType.value
        return !isNil(type)
          ? buildDefaultModalSubmitRequest(ctx)?.[type]
          : undefined
      }),
      successRequest: ctx.scope.table.reload,
    }

    for (const k of keys) {
      // @ts-ignore
      commonFormOptions[k] = computed(() => {
        const type = modalType.value
        return !isNil(type)
          ? mergeWithTovalue(
              {},
              // @ts-ignore
              toValue(form?.[k]),
              // @ts-ignore
              toValue(formMap[type]?.[k])
            )
          : {}
      })
    }

    return {
      modalProps: resolvedModalProps,
      submitter: resolvedSubmitter,
      form: commonFormOptions,
      renderTrigger: false,
      show: true,
    }
  })

  ctx.modalFormBinding = modalFormBinding
}

function buildBasicMiddleware(ctx: BuildCrudContext, next: NextMiddleware) {
  const result = ctx.options(ctx.scope)

  // 标记 optionResult 不可被覆盖解绑
  markIgnoreMerge(ctx.optionResult)

  ctx.optionResult = mergeWithNoUnref(
    {},
    buildDefaultCrudOptions(ctx.scope, result),
    getGlobalOptions().crudOptions,
    result
  )

  next()
}
