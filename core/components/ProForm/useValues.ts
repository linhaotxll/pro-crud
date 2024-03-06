import { cloneDeep, merge } from 'lodash-es'
import { computed, toRaw, toValue, watch } from 'vue'

import type { BuildFormOptionResult, ProFormScope } from './interface'

export function useValues<T extends object>(
  values: T,
  scope: ProFormScope<T>,
  initialValues: Partial<T> | undefined,
  columns: BuildFormOptionResult<T>['columns']
) {
  // 初始化合并默认值
  const originInitialValues = cloneDeep(toRaw(initialValues))
  merge(values, originInitialValues)

  const columnCount = computed(() => toValue(columns)?.length)

  // 列的数量发生变化需要重置表单数据
  if (initialValues) {
    watch(columnCount, () => {
      scope.reset()
    })
  }
}
