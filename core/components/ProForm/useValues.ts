import { cloneDeep } from 'lodash-es'
import { toRaw } from 'vue'

import { mergeWithTovalue } from '../common'

export function useValues<T = any>(
  values: T,
  initialValues: Partial<T> | undefined
) {
  // 初始化合并默认值
  const originInitialValues = cloneDeep(toRaw(initialValues))
  mergeWithTovalue(values, originInitialValues)
}
