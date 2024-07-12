import { computed, ref, toValue, watchEffect } from 'vue'

import { buildDefaultCrudOptions } from './constant'
import { type BuildCrudOptionReturn, type ProCrudScope } from './interface'
import { ModalType } from './interface'

import {
  compose,
  mergeWithTovalue,
  type DataObject,
  type NextMiddleware,
} from '../common'
import { buildModalForm } from '../ModalForm'
import { buildTable } from '../ProTable'

import type {
  BuildCrudContext,
  BuildCrudResult,
  ProCrudModalScope,
} from './interface'
import type { ProFormColumnOptions } from '../ProForm'
import type { ProInnerFormOptions } from '../ProTable'
import type { FormProps } from 'ant-design-vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

export function buildCrud<
  Data extends DataObject = DataObject,
  Collection = any
>(
  options: (
    scope: ProCrudScope<Data>
  ) => BuildCrudOptionReturn<Data, Collection>
): BuildCrudResult<Data> {
  const context: BuildCrudContext<Data, Collection> = {
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
const formPropsWithModalType: Record<ModalType, FormProps | undefined> = {
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
    } = ctx.optionResult

    const addFormColumns = ref([]) as Ref<ProFormColumnOptions[]>
    const editFormColumns = ref([]) as Ref<ProFormColumnOptions[]>
    const viewFormColumns = ref([]) as Ref<ProFormColumnOptions[]>

    const formColumsMap: Record<ModalType, Ref<ProFormColumnOptions[]>> = {
      [ModalType.Add]: addFormColumns,
      [ModalType.Edit]: editFormColumns,
      [ModalType.View]: viewFormColumns,
    }

    const formMap: Record<
      ModalType,
      | MaybeRefOrGetter<ProInnerFormOptions<Partial<DataObject>, any>>
      | undefined
    > = {
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
          // 新增表单列
          prev.add.push(
            mergeWithTovalue(
              { label: column.label, name: column.name, type: column.type },
              toValue(column.form),
              toValue(column.addForm)
            )
          )

          // 编辑表单列
          prev.edit.push(
            mergeWithTovalue(
              { label: column.label, name: column.name, type: column.type },
              toValue(column.form),
              toValue(column.editForm)
            )
          )

          // 查看表单列
          prev.view.push(
            mergeWithTovalue(
              { label: column.label, name: column.name, type: column.type },
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

    return {
      modalProps,
      submitter,
      form: computed(() => {
        const type = modalType.value
        return mergeWithTovalue(
          {},
          toValue(form),
          type ? toValue(formMap[type]) : undefined,
          type
            ? {
                columns: formColumsMap[type].value,
                formProps: formPropsWithModalType[type],
              }
            : undefined
        )
      }),
      renderTrigger: false,
    }
  })

  ctx.modalFormBinding = modalFormBinding
}

function buildBasicMiddleware(ctx: BuildCrudContext, next: NextMiddleware) {
  ctx.optionResult = ctx.options(ctx.scope) ?? {}

  ctx.optionResult = mergeWithTovalue(
    { autoReload: true },
    ctx.optionResult,
    buildDefaultCrudOptions(ctx)
  )
  next()
}
