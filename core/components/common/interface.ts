import { type MaybeRefOrGetter } from '@vueuse/core'
import { type ComputedRef, type VNode } from 'vue'

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

export type DeepMaybeRefOrGetter<T> = T extends object
  ? {
      [K in keyof T]: DeepMaybeRefOrGetter<T[K]>
    }
  : MaybeRefOrGetter<T>

export type Arrayable<T> = T | T[]

export type JSXElement = VNode | number | string | undefined | null

export type ValueOf<T> = T[keyof T]

export type NamePath = string | number | (string | number)[]

export type DataObject = Record<any, any>
