import { SearchOutlined, SyncOutlined } from '@ant-design/icons-vue'
import { merge } from 'lodash-es'
import { computed, h } from 'vue'

import {
  DefaultButtonsCol,
  DefaultSearchCol,
  DefaultSearchRow,
} from './constant'

import { unRef } from '../common'
import { buildForm } from '../ProForm'

import type {
  BuildSearchOptionResult,
  BuildSearchResult,
  ProSearchScope,
} from './interface'
import type { ButtonsOption } from '../ProForm'
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

    const buttons: ButtonsOption = {
      col: computed(() => {
        // debugger
        const defaultCol: ColProps = merge(
          DefaultButtonsCol,
          unRef(props.wrapperCol)
        )

        const total =
          props.columns?.reduce<number>((prev, columnComputed) => {
            const columnLabelCol: ColProps | undefined = unRef(
              columnComputed.itemProps?.labelCol
            )
            const columnWrapperCol: ColProps | undefined = unRef(
              columnComputed.itemProps?.wrapperCol
            )

            const show = unRef(columnComputed.show!)

            let columnTotal = 0
            if (show) {
              if (columnLabelCol) {
                columnTotal +=
                  +(columnLabelCol.span ?? 0) + +(columnLabelCol.offset ?? 0)
              }
              if (columnWrapperCol) {
                columnTotal +=
                  +(columnWrapperCol.span ?? 0) +
                  +(columnWrapperCol.offset ?? 0)
              }
            }

            const result = prev + columnTotal

            if (result > 24) {
              prev = 0
            }

            prev += columnTotal

            return prev
          }, 0) ?? 0

        const resolveButtons = merge(unRef(props.buttons?.col), defaultCol)
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

      show: props.buttons?.show,
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
    const mergedButtons = merge(buttons, props.buttons)

    const result = merge(props, {
      buttons: mergedButtons,
      col: DefaultSearchCol,
      row: DefaultSearchRow,
    })

    return result
  }, ctx)

  return {
    proSearchRef: proFormRef,
    proSearchBinding: proFormBinding,
  }
}
