import { computed, isRef, reactive, ref, watchEffect } from 'vue'

import { DefaultTableColumnShow } from './constant'

import { unRef } from '../common'

import type {
  InternalProTableColumnProps,
  ProTableColumnProps,
} from './interface'
import type { ComputedRef, Ref } from 'vue'

export function useColumns<T extends object>(
  columns: ProTableColumnProps<T>[]
) {
  const resolvedShow = reactive<Record<string, Ref<boolean>>>({})
  const resolvedColumns: ComputedRef<InternalProTableColumnProps<T>>[] = []

  if (columns) {
    for (let i = 0; i < columns.length; ++i) {
      const column = columns[i]

      watchEffect(() => {
        const prop = unRef(column.prop)
        const show = isRef(column.show)
          ? column.show
          : ref(column.show ?? DefaultTableColumnShow)
        resolvedShow[prop] = show
      })

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

          return result
        })
      )
    }
  }

  console.log('resolvedColumns: ', resolvedColumns)

  return { columns: resolvedColumns, columnsShow: resolvedShow }
}
