import { PlusOutlined } from '@ant-design/icons-vue'
import { h, unref } from 'vue'

import { ModalType } from './interface'

import type {
  BuildCrudContext,
  BuildCrudOptionReturn,
  ProCrudScope,
} from './interface'
import type { ModalFormActionGroup } from '../ModalForm'
import type { ModalProps } from 'ant-design-vue'

/**
 * 默认 Crud 返回值
 */
export const buildDefaultCrudOptions = (
  scope: ProCrudScope,
  optionResult: BuildCrudOptionReturn
): BuildCrudOptionReturn => {
  const { deleteRequest } = optionResult

  const result: BuildCrudOptionReturn = {
    search: {
      action: {
        actions: {
          confirm: {
            show: true,
            text: '搜索',
            props: {
              type: 'primary',
              onClick() {
                return scope.search.submit()
              },
            },
          },

          reset: {
            show: true,
            text: '重置',
            props: {
              onClick() {
                scope.search.reset()
                if (optionResult.autoReload ?? true) {
                  scope.search.submit()
                }
              },
            },
          },
        },
      },
    },
    actionColumn: {
      show: true,
      columnProps: { width: '15%' },
      action: {
        actions: {
          view: {
            show: true,
            text: '查看',
            props: {
              onClick(_, ctx) {
                scope.modal.showViewModal(ctx.record)
              },
            },
          },

          edit: {
            show: true,
            text: '编辑',
            props: {
              type: 'primary',
              onClick(_, ctx) {
                scope.modal.showEditModal(ctx.record)
              },
            },
          },

          delete: {
            show: true,
            text: '删除',
            confirmType: 'modal',
            confirmProps: {
              title: '确认删除这一项？',
              okButtonProps: { danger: true },
              okText: '确认',
              cancelText: '取消',
              onOk: (_, ctx) =>
                Promise.resolve(deleteRequest?.(ctx) ?? false).then(res => {
                  if (res) {
                    scope.table.reload()
                  }
                }),
            },
            props: {
              type: 'primary',
              danger: true,
            },
          },
        },
      },
    },
    toolbar: {
      space: {
        style: 'justify-content: end',
      },
      actions: {
        add: {
          show: true,
          props: {
            icon: h(PlusOutlined),
            type: 'primary',
            shape: 'circle',
            onClick() {
              scope.modal.showAddModal()
            },
          },
        },
      },
    },
    wrapperProps: {
      gap: 16,
    },
  }

  return result
}

export const defaultModalProps: Record<ModalType, ModalProps> = {
  [ModalType.Add]: { title: '新增' },
  [ModalType.Edit]: { title: '编辑' },
  [ModalType.View]: { title: '查看' },
}

export const buildDefaultModalSubmitter = (): Record<
  ModalType,
  ModalFormActionGroup | undefined
> => ({
  [ModalType.Add]: undefined,
  [ModalType.Edit]: undefined,
  [ModalType.View]: { actions: { ok: { show: false } } },
})

export const buildDefaultModalSubmitRequest = (ctx: BuildCrudContext) => {
  return {
    [ModalType.Add]: ctx.optionResult.addRequest,
    [ModalType.Edit]: ctx.optionResult.editRequest,
    [ModalType.View]: undefined,
  }
}

export const buildDefaultModalBeforeSubmit = (ctx: BuildCrudContext) => {
  return {
    [ModalType.Add]: unref(ctx.optionResult.addForm?.beforeSubmit),
    [ModalType.Edit]: unref(ctx.optionResult.editForm?.beforeSubmit),
    [ModalType.View]: undefined,
  }
}

export const buildDefaultModalValidateFail = (ctx: BuildCrudContext) => {
  return {
    [ModalType.Add]: unref(ctx.optionResult.addForm?.validateFail),
    [ModalType.Edit]: unref(ctx.optionResult.editForm?.validateFail),
    [ModalType.View]: undefined,
  }
}

// export const buildDefaultModalToast = (ctx: BuildCrudContext) => {
//   return {
//     [ModalType.Add]: unref(ctx.optionResult.addToast),
//     [ModalType.Edit]: unref(ctx.optionResult.editToast),
//     [ModalType.View]: undefined,
//   }
// }
