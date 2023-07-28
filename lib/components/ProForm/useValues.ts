import { cloneDeep, get, set } from 'lodash-es'
import { provide, reactive } from 'vue'

import type { ProFormColumnOptions } from './interface'

export function useValues<T extends object>(
  initialValues: Partial<T> | undefined,
  columns: ProFormColumnOptions<T>[]
) {
  const values = reactive<T>((cloneDeep(initialValues) as T) ?? ({} as T)) as T

  for (const column of columns) {
    const { transform, prop } = column
    if (typeof transform?.from === 'function') {
      set(values, column.prop, transform.from(get(values, prop)))
    }
  }

  provide(ProFormValueKey, values)

  return values
}
