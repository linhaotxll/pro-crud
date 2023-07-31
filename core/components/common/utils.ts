import { isRef } from 'vue'

import type { MaybeRef } from './interface'

const hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = (obj: any, key: PropertyKey) =>
  hasOwnProperty.call(obj, key)

export function unRef<T>(value: MaybeRef<T>): T {
  return isRef(value) ? value.value : value
}
