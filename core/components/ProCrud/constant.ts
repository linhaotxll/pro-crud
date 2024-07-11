import { PlusOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

import { showToast } from '../Toast'

import type { BuildCrudContext, BuildCrudOptionReturn } from './interface'

/**
 * 默认 Crud 返回值
 */
export const buildDefaultCrudOptions = ({
  scope,
  optionResult: { deleteRequest, deleteToast },
}: BuildCrudContext): BuildCrudOptionReturn => {
  return {
    addToast: '新增成功',
    editToast: '编辑成功',
    deleteToast: '删除成功',
    search: {
      action: {
        actions: {
          search: {
            show: true,
            text: '搜索',
            props: {
              type: 'primary',
              onClick() {
                scope.search.submit()
              },
            },
          },

          reset: {
            show: true,
            text: '重置',
            props: {
              onClick() {
                scope.search.reset()
              },
            },
          },
        },
      },
    },
    actionColumn: {
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
                scope.modal.showViewModal(ctx.record)
              },
            },
          },

          delete: {
            show: true,
            text: '删除',
            confirmType: 'modal',
            confirmProps: {
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
  }
}
