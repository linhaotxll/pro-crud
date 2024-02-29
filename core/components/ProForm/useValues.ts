import { cloneDeep, get, merge, set } from 'lodash-es'

import { unRef } from '../common'

import type { ProFormColumnOptions } from './interface'

export function useValues<T extends object>(
  values: T,
  initialValues: Partial<T> | undefined,
  columns: ProFormColumnOptions<T>[]
) {
  if (initialValues) {
    merge(values, cloneDeep(initialValues))
  }

  if (columns) {
    for (const column of columns) {
      const { transform, name } = column
      if (typeof transform?.from === 'function') {
        const resolvedName = unRef(name)
        if (resolvedName) {
          set(values, resolvedName, transform.from(get(values, resolvedName)))
        }
      }
    }
  }

  return values
}
