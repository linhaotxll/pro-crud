import { computed, ref, toValue } from 'vue'

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

import type { BuildCrudContext, ProCrudModalScope } from './interface'
import type { FormProps } from 'ant-design-vue'

export function buildCrud<
  Data extends DataObject = DataObject,
  Collection = any
>(
  options: (
    scope: ProCrudScope<Data>
  ) => BuildCrudOptionReturn<Data, Collection>
) {
  const context: BuildCrudContext<Data, Collection> = {
    options,
    optionResult: null!,
    scope: {
      table: null!,
      search: null!,
      modal: null!,
    },
  }

  compose<BuildCrudContext>([
    buildTableMiddleware,
    buildModalFormMiddleware,
    buildBasicMiddleware,
  ])(context)
}

function buildTableMiddleware(ctx: BuildCrudContext, next: NextMiddleware) {
  //
  buildTable(tableScope => {
    ctx.scope.table = tableScope.table
    ctx.scope.search = tableScope.search
    next()

    // const {
    // columns,
    // autoReload,
    // deleteToast,
    // addToast,
    // editToast,
    // addRequest,
    // editRequest,
    // deleteRequest,
    // fetchTableData,
    // ...rest
    // } = ctx.optionResult

    return {
      // ...rest,
      // fetchTableData,
    }
  })
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
  buildModalForm(({ showModal, ...rest }) => {
    function showModalWithType(type: ModalType, record: any) {
      modalType.value = type
      rest.setFieldValues(record)
      showModal()
    }

    ctx.scope.modal = {
      ...rest,
      showAddModal(record) {
        showModalWithType(ModalType.Add, record)
      },
      showEditModal(record) {
        showModalWithType(ModalType.Edit, record)
      },
      showViewModal(record) {
        showModalWithType(ModalType.View, record)
      },
    } as ProCrudModalScope

    next()

    const { modalProps, submitter, form } = ctx.optionResult

    return {
      modalProps,
      submitter,
      form: computed(() =>
        mergeWithTovalue(
          {},
          toValue(form),
          modalType.value
            ? {
                formProps: formPropsWithModalType[modalType.value],
              }
            : undefined
        )
      ),
    }
  })
}

function buildBasicMiddleware(ctx: BuildCrudContext, next: NextMiddleware) {
  ctx.optionResult = mergeWithTovalue(
    {},
    ctx.options(ctx.scope),
    buildDefaultCrudOptions(ctx)
  )
  next()
}
