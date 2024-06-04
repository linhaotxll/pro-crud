import { mergeWith } from 'lodash-es'
import { isRef, toValue, unref } from 'vue'

// export function mergeWithTovalue<TObject, TSource>(
//   object: TObject,
//   source: TSource
// ): TObject & TSource

// export function mergeWithTovalue<TObject, TSource1, TSource2>(
//   object: TObject,
//   source1: TSource1,
//   source2: TSource2
// ): TObject & TSource1 & TSource2

// export function mergeWithTovalue<TObject, TSource1, TSource2, TSource3>(
//   object: TObject,
//   source1: TSource1,
//   source2: TSource2,
//   source3: TSource3
// ): TObject & TSource1 & TSource2 & TSource3

// export function mergeWithTovalue<
//   TObject,
//   TSource1,
//   TSource2,
//   TSource3,
//   TSource4
// >(
//   object: TObject,
//   source1: TSource1,
//   source2: TSource2,
//   source3: TSource3,
//   source4: TSource4
// ): TObject & TSource1 & TSource2 & TSource3 & TSource4

// export function mergeWithTovalue(object: any, ...otherArgs: any[]): any

// export function mergeWithTovalue<TObject>(
//   object: TObject,
//   source: any
// ): ToDeepMaybeRefOrGetter<TObject>
// export function mergeWithTovalue<TObject, TSource1, TSource2>(
//   object: TObject,
//   source1: TSource1,
//   source2: TSource2
// ): ToDeepMaybeRefOrGetter<TObject> &
//   ToDeepMaybeRefOrGetter<TSource1> &
//   ToDeepMaybeRefOrGetter<TSource2>
// export function mergeWithTovalue<TObject, TSource1, TSource2, TSource3>(
//   object: TObject,
//   source1: TSource1,
//   source2: TSource2,
//   source3: TSource3
// ): ToDeepMaybeRefOrGetter<TObject> &
//   ToDeepMaybeRefOrGetter<TSource1> &
//   ToDeepMaybeRefOrGetter<TSource2> &
//   ToDeepMaybeRefOrGetter<TSource3>
// export function mergeWithTovalue<
//   TObject,
//   TSource1,
//   TSource2,
//   TSource3,
//   TSource4
// >(
//   object: TObject,
//   source1: TSource1,
//   source2: TSource2,
//   source3: TSource3,
//   source4: TSource4
// ): ToDeepMaybeRefOrGetter<TObject> &
//   ToDeepMaybeRefOrGetter<TSource1> &
//   ToDeepMaybeRefOrGetter<TSource2> &
//   ToDeepMaybeRefOrGetter<TSource3> &
//   ToDeepMaybeRefOrGetter<TSource4>

export function mergeWithTovalue<T = any>(target: any, ...source: any[]): T {
  const args = [
    target,
    ...source,
    (_: any, srcValue: any) => {
      return isRef(srcValue) ? toValue(srcValue) ?? null : undefined
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
