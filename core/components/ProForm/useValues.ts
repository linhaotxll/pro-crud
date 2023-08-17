import { cloneDeep, get, set } from 'lodash-es'
import { reactive } from 'vue'

import { unRef } from '../common'

import type { ProFormColumnOptions } from './interface'

export function useValues<T extends object>(
  initialValues: Partial<T> | undefined,
  columns: ProFormColumnOptions<T>[]
) {
  const values = reactive<T>((cloneDeep(initialValues) as T) ?? ({} as T)) as T

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
