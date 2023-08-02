import type { Ref, ComputedRef } from 'vue'

export type ToHandles<T> = {
  [P in keyof T as P extends string ? `on${Capitalize<P>}` : never]: (
    ...args: T[P] extends (...args: any) => any ? Parameters<T[P]> : []
  ) => void
}

export type MaybeRef<T> = T | Ref<T> | ComputedRef<T>

export type ExtractMaybeRef<T> = {
  [P in keyof T]: MaybeRef<T[P]>
}

type UnionToIntersection<T> = (
  T extends any ? (args: T) => any : never
) extends (args: infer R) => any
  ? R
  : never

type LastInUnion<T> = UnionToIntersection<
  T extends any ? (arg: T) => any : never
> extends (arg: infer R) => any
  ? R
  : never

export type UnionToTuple<T, U = T> = [T] extends [never]
  ? []
  : [LastInUnion<T>, ...UnionToTuple<Exclude<U, LastInUnion<T>>>]

export declare type Arrayable<T> = T | T[]
