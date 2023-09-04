import { SearchOutlined, SyncOutlined } from '@ant-design/icons-vue'
import { merge } from 'lodash-es'
import { computed, h } from 'vue'

import { DefaultSearchCol, DefaultSearchRow } from './constant'

import { unRef } from '../common'
import { buildForm, DefaultProProColumn } from '../ProForm'

import type {
  BuildSearchOptionResult,
  BuildSearchResult,
  ProSearchScope,
} from './interface'
import type { ProFormActionsOptions } from '../ProForm'
import type { ColProps } from 'ant-design-vue'

export function buildSearch<T extends object, C = undefined, R = T>(
  options: (
    scope: ProSearchScope<T>,
    ctx?: C | undefined
  ) => BuildSearchOptionResult<T, R>
): BuildSearchResult<T>
export function buildSearch<T extends object, C, R = T>(
  options: (scope: ProSearchScope<T>, ctx: C) => BuildSearchOptionResult<T, R>,
  context: C
): BuildSearchResult<T>

export function buildSearch<T extends object, C, R = T>(
  options: (scope: ProSearchScope<T>, ctx?: C) => BuildSearchOptionResult<T, R>,
  ctx?: C
): BuildSearchResult<T> {
  const { proFormRef, proFormBinding } = buildForm(scope => {
    // @ts-ignore
    const props = options(scope)

    const buttons: ProFormActionsOptions = {
      col: computed(() => {
        // debugger
        const defaultCol: ColProps = merge(DefaultSearchCol, unRef(props.col))

        const total =
          props.columns?.reduce<number>((prev, column) => {
            // 每个列所占的格子数量
            const columnCol: ColProps | undefined = unRef(column.col)

            const show = unRef(column.show ?? DefaultProProColumn.show)

            let columnTotal = 0
            if (show) {
              if (columnCol) {
                columnTotal += +(columnCol.span ?? 0) + +(columnCol.offset ?? 0)
              } else {
                columnTotal +=
                  +(defaultCol.span ?? 0) + +(defaultCol.offset ?? 0)
              }
            }

            const result = prev + columnTotal

            if (result > 24) {
              prev = 0
            }

            prev += columnTotal

            return prev
          }, 0) ?? 0

        const resolveButtons = merge(unRef(props.actions?.col), defaultCol)
        const span = +resolveButtons.span!

        let offset = 0
        const residueSpan = 24 - total
        if (residueSpan < span) {
          offset = 24 - span
        } else {
          offset = 24 - total - span
        }

        return {
          span,
          offset,
        }
      }),

      show: props.actions?.show,
      list: {
        reset: {
          show: true,
          text: '重置',
          props: {
            icon: h(SyncOutlined),
            onClick: () => {
              scope.resetFields()
            },
          },
        },

        confirm: {
          text: '搜索',
          props: {
            icon: h(SearchOutlined),
          },
        },
      },
    }
    const mergedButtons = merge(buttons, props.actions)

    const result = merge(props, {
      actions: mergedButtons,
      col: merge({}, DefaultSearchCol, props.col),
      row: merge({}, DefaultSearchRow, props.row),
    })

    return result
  }, ctx)

  return {
    proSearchRef: proFormRef,
    proSearchBinding: proFormBinding,
  }
}
