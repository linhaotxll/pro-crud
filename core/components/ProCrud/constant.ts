import { PlusOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

import { ModalType } from './interface'

import { showToast } from '../Toast'

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
  ctx: BuildCrudContext
): BuildCrudOptionReturn => {
  const {
    scope,
    optionResult: { deleteRequest, deleteToast },
  } = ctx

  return {
    addToast: '新增成功',
    editToast: '编辑成功',
    deleteToast: '删除成功',
    search: {
      action: {
        space: {
          style: 'width: 100%; justify-content: end',
        },
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
                if (ctx.optionResult.autoReload) {
                  scope.table.reload()
                }
              },
            },
          },
        },
      },
      submitRequest: () => true,
      toast: false,
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
                    showToast(deleteToast)
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
    // submitter: {
    //   actions: {
    //     ok: { show: false },
    //   },
    // },
  }
}

export const defaultModalProps: Record<ModalType, ModalProps> = {
  [ModalType.Add]: { title: '新增' },
  [ModalType.Edit]: { title: '编辑' },
  [ModalType.View]: { title: '查看' },
}

export const buildDefaultModalSubmitter = (
  ctx: BuildCrudContext
): Record<ModalType, ModalFormActionGroup | undefined> => ({
  [ModalType.Add]: {
    actions: {
      ok: {
        props: {
          onClick() {
            return Promise.resolve(
              ctx.optionResult.addRequest?.(ctx.scope.modal.getFormValues())
            ).then(res => {
              if (res) {
                showToast(ctx.optionResult.addToast)

                ctx.scope.modal.hideModal()
                ctx.scope.table.reload()
              }
            })
          },
        },
      },
    },
  },
  [ModalType.Edit]: {
    actions: {
      ok: {
        props: {
          onClick() {
            return Promise.resolve(
              ctx.optionResult.editRequest?.(ctx.scope.modal.getFormValues())
            ).then(res => {
              if (res) {
                showToast(ctx.optionResult.editToast)

                ctx.scope.modal.hideModal()
                ctx.scope.table.reload()
              }
            })
          },
        },
      },
    },
  },
  [ModalType.View]: { actions: { ok: { show: false } } },
})
