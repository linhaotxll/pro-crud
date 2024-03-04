import { type ComputedRef, type VNode, type MaybeRefOrGetter } from 'vue'

export type ToHandles<T> = {
  [P in keyof T as P extends string ? `on${Capitalize<P>}` : never]: (
    ...args: T[P] extends (...args: any) => any ? Parameters<T[P]> : []
  ) => void
}

export type MaybeRef<T> = ComputedRef<T> | MaybeRefOrGetter<T>

export type ExtractMaybeRef<T> = T extends object
  ? MaybeRef<{
      [K in keyof T]: ExtractMaybeRef<T[K]>
    }>
  : T extends boolean
  ? MaybeRef<boolean>
  : T extends undefined
  ? never
  : MaybeRef<T>

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

export type Arrayable<T> = T | T[]

export type JSXElement = VNode | number | string | undefined | null

export type ValueOf<T> = T[keyof T]
