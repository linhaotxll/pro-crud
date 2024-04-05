import { cloneDeep, merge } from 'lodash-es'
import { toRaw } from 'vue'

export function useValues<T = any>(
  values: T,
  initialValues: Partial<T> | undefined
) {
  // 初始化合并默认值
  const originInitialValues = cloneDeep(toRaw(initialValues))
  merge(values, originInitialValues)
}
