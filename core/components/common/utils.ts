import { isRef, ref } from 'vue'

import type { MaybeRef } from './interface'
import type { SuccessToastOptions } from '../Toast'
import type { Ref } from 'vue'

const hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = (obj: any, key: PropertyKey) =>
  hasOwnProperty.call(obj, key)

export function unRef<T>(value: MaybeRef<T>): T {
  return isRef(value) ? value.value : value
}

export function resolveRef<T>(value: MaybeRef<T>) {
  return isRef(value) ? value : (ref(value) as Ref<T>)
}

export function genToast(content: string): SuccessToastOptions {
  // @ts-ignore
  return { type: 'message', props: { title: content, message: content } }
}
