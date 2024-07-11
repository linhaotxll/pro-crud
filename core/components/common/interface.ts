import type { MaybeRef, MaybeRefOrGetter } from 'vue'

export type ExtractMaybeRef<T> = T extends object
  ? MaybeRef<{
      [K in keyof T]: ExtractMaybeRef<T[K]>
    }>
  : T extends boolean
  ? MaybeRef<boolean>
  : T extends undefined
  ? never
  : MaybeRef<T>

// export type DeepMaybeRefOrGetter<T> = T extends object
//   ? {
//       [K in keyof T]: DeepMaybeRefOrGetter<T[K]>
//     }
//   : MaybeRefOrGetter<T>

export type DeepMaybeRefOrGetter<T> = T extends MaybeRefOrGetter<infer V>
  ? MaybeRefOrGetter<V>
  : T extends Array<any> | object
  ? {
      [K in keyof T]: DeepMaybeRefOrGetter<T[K]>
    }
  : MaybeRefOrGetter<T>

export type Arrayable<T> = T | T[]

export type NamePath = string | number | (string | number)[]

export type DataObject = Record<any, any>
