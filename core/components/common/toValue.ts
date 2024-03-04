import { isRef, toValue as vueToValue } from 'vue'

import type { MaybeRef } from './interface'

export function toValue<T>(source: MaybeRef<T>) {
  return isRef(source) ? toValue(source) : vueToValue(source)
}
