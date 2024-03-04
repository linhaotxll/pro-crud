import { cloneDeep, get, merge, set } from 'lodash-es'
import { toValue, watchEffect } from 'vue'

import type { BuildFormOptionResult } from './interface'

export function useValues<T extends object>(
  values: T,
  initialValues: Partial<T> | undefined,
  columns: BuildFormOptionResult<T>['columns']
) {
  watchEffect(() => {
    const columnsValue = toValue(columns)

    if (columnsValue) {
      if (initialValues) {
        merge(values, cloneDeep(initialValues))
      }

      for (const column of columnsValue) {
        const {
          // transform,
          name,
        } = column
        // if (typeof transform?.from === 'function') {
        //   const resolvedName = unRef(name)
        //   if (resolvedName) {
        //     set(values, resolvedName, transform.from(get(values, resolvedName)))
        //   }
        // }
      }
    }
  })
}
