import { mergeWith } from 'lodash-es'
import { isRef, toValue } from 'vue'

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

export function mergeWithTovalue(target: any, ...source: any[]) {
  const args = [
    target,
    ...source,
    (_: any, srcValue: any) =>
      isRef(srcValue) ? toValue(srcValue) : undefined,
  ]
  // @ts-ignore
  return mergeWith(...args)
}
