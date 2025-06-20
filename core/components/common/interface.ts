import type { MaybeRef } from 'vue'

export type ExtractMaybeRef<T> = T extends object
  ? MaybeRef<{
      [K in keyof T]: ExtractMaybeRef<T[K]>
    }>
  : T extends boolean
  ? MaybeRef<boolean>
  : T extends undefined
  ? never
  : MaybeRef<T>

export type Arrayable<T> = T | T[]

export type NamePath = string | number | (string | number)[]

export type DataObject = Record<any, any>
