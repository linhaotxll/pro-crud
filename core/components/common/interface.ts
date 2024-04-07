import { type MaybeRefOrGetter } from '@vueuse/core'
import { type ComputedRef, type VNode } from 'vue'

import type { TableProps } from 'ant-design-vue'
import type { Ref } from 'vue'

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

type RefOrGetter<T> = Ref<T> | (() => T)

export type ToDeepMaybeRefOrGetter<T> = T extends RefOrGetter<infer R>
  ? ToDeepMaybeRefOrGetter<R>
  : // @ts-ignore
  T extends Record<unknown, unknown>
  ? {}
  : T extends object
  ? {
      [K in keyof T]: ToDeepMaybeRefOrGetter<T[K]>
    }
  : T

export function aaa<Data extends DataObject = DataObject>(value: Data) {
  type A = ToDeepMaybeRefOrGetter<TableProps<Data>>
  type B = ToDeepMaybeRefOrGetter<TableProps<DataObject>>

  return value
}

// type A = {
//   info: {
//     name: string
//     age?: number
//     gender?: 'male' | 'female'
//   }
// }

// type D = ToDeepMaybeRefOrGetter<{
//   age: MaybeRefOrGetter<number>
// }>

// type B = DeepMaybeRefOrGetter<A>
// type C = ToDeepMaybeRefOrGetter<B>

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

export type NamePath = string | number | (string | number)[]

export type DataObject = Record<any, any>

// -------------------------
interface Person {
  name: string
  age: number
  address: {
    street: string
    city: string
    country: string
  }
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type DeepAddProp<T, K extends string, V> = {
  [P in keyof T]: P extends K
    ? V
    : T[P] extends object
    ? DeepAddProp<T[P], K, V>
    : T[P]
}

// 修改深度嵌套属性的类型
type ModifiedPerson = DeepPartial<Person> // { name?: string; age?: number; address?: { street?: string; city?: string; country?: string; } }

// 添加深度嵌套属性
type AddedPerson = DeepAddProp<Person, 'phone', string> // { name: string; age: number; address: { street: string; city: string; country: string; }; phone?: string; }

// 完整示例：修改和添加深度嵌套属性的类型
interface Person {
  name: string
  age: number
  address: {
    street: string
    city: string
    country: string
  }
}
