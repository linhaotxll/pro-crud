import { unref, type MaybeRef } from 'vue'

export type MaybeRefOrGetter<T, C = any> = MaybeRef<T> | ((ctx: C) => T)

type AnyFn = (...args: any[]) => any

export function toValueWithCtx<T, C = any>(
  r: MaybeRefOrGetter<T, C>,
  ctx?: C
): T {
  return typeof r === 'function' ? (r as AnyFn)(ctx) : unref(r)
}
