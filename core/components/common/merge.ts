import { mergeWith } from 'lodash-es'
import { isRef, unref } from 'vue'

import { toValueWithCtx } from './toValue'

export function mergeWithTovalue<T = any>(target: any, ...source: any[]): T {
  const args = [
    target,
    ...source,
    (_: any, srcValue: any) => {
      return isRef(srcValue) ? toValueWithCtx(srcValue) ?? null : undefined
    },
  ]
  // @ts-ignore
  return mergeWith(...args)
}

export function mergeWithUnref<T = any>(target: any, ...source: any[]): T {
  const args = [
    target,
    ...source,
    (_: any, srcValue: any) => {
      return isRef(srcValue) ? unref(srcValue) ?? null : undefined
    },
  ]
  // @ts-ignore
  return mergeWith(...args)
}
