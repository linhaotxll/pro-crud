import { computed, isRef, reactive, watchEffect } from 'vue'

import { DefaultTableColumnShow } from './constant'

import { unRef } from '../common'

import type {
  InternalProTableColumnProps,
  ProTableColumnProps,
} from './interface'
import type { ComputedRef } from 'vue'

export function useColumns<T extends object>(
  tableColumns: ProTableColumnProps<T>[]
) {
  const resolvedShow = reactive<Record<string, boolean>>({})
  const resolvedFixed = reactive<Record<string, boolean | string | undefined>>(
    {}
  )

  const resolvedColumns: ComputedRef<InternalProTableColumnProps<T>>[] =
    reactive([])

  for (let i = 0; i < tableColumns.length; ++i) {
    const column = tableColumns[i]

    watchEffect(
      () => {
        const prop = unRef(column.prop)
        const show = isRef(column.show)
          ? column.show.value
          : column.show ?? DefaultTableColumnShow

        const props = unRef(column.columnProps)
        const fixed = unRef(props?.fixed)

        resolvedShow[prop] = show
        resolvedFixed[prop] = fixed
      },
      { flush: 'pre' }
    )

    resolvedColumns.push(
      computed(() => {
        const prop = unRef(column.prop)

        const result: InternalProTableColumnProps<T> = {
          show: resolvedShow[prop],
          columnProps: {
            label: unRef(column.label),
            prop,
          },
          columnSlots: column.columnSlots,
        }

        console.log('解析 column: ', result.columnProps.label)

        const p = unRef(column.columnProps)
        if (p) {
          Object.keys(p).forEach(key => {
            // @ts-ignore
            result.columnProps[key] = unRef(p[key])
          })
        }

        result.columnProps.fixed = resolvedFixed[prop]

        return result
      })
    )
  }

  function sort(fromIndex: number, toIndex: number) {
    const [item] = resolvedColumns.splice(fromIndex, 1)
    resolvedColumns.splice(toIndex, 0, item)
  }

  function setFixed(prop: string, fixed?: string | boolean) {
    resolvedFixed[prop] = fixed
  }

  return {
    columns: resolvedColumns,
    columnsShow: resolvedShow,
    sort,
    setFixed,
  }
}
