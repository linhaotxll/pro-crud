import { merge } from 'lodash-es'
import { computed } from 'vue'

import { unRef } from '../common'
import { buildForm } from '../ProForm'

import type {
  BuildSearchOptionResult,
  BuildSearchResult,
  ProSearchScope,
} from './interface'
import type { ElColProps, ElRowProps } from '../common'
import type { ButtonsOption } from '../ProForm'

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
        const defaultCol: ElColProps = unRef(props.col) ?? { span: 4 }

        const total =
          props.columns?.reduce<number>((prev, columnComputed) => {
            const columnCol = unRef(columnComputed.col)

            const columnTotal = columnCol
              ? (columnCol.span || 0) + (columnCol.offset || 0)
              : defaultCol.span!

            const result = prev + columnTotal

            if (result > 24) {
              prev = 0
            }

            prev += columnTotal

            return prev
          }, 0) ?? 0

        const resolveButtons = merge(unRef(props.buttons?.col), defaultCol)
        const span = resolveButtons.span!

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
            onClick: () => {
              scope.resetFields()
            },
          },
        },
      },
    }

    const row: ElRowProps = merge(props.row || {}, { gutter: 16 })

    const col = computed<ElColProps>(() =>
      merge({}, { span: 4 }, unRef(props.col))
    )

    return merge(props, { buttons, row, col })
  }, ctx)

  return {
    proSearchRef: proFormRef,
    proSearchBinding: proFormBinding,
  }
}
