import { isArray, isPlainObject, mergeWith } from 'lodash-es'
import { isRef, toValue, unref } from 'vue'

const getRawType = (val: unknown) => {
  return Object.prototype.toString.call(val).slice(8, -1)
}

export function mergeWithTovalue<T = any>(target: any, ...sources: any[]): T {
  merge(target, value => unref(value), ...sources)
  return target
}

export function mergeWithNormal<T = any>(target: any, ...sources: any[]): T {
  merge(target, value => unref(value), ...sources)
  return target
}

export function mergeWithTovalueNoFunc<T = any>(
  target: any,
  ...sources: any[]
): T {
  merge(target, value => unref(value), ...sources)
  return target
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

export function merge(
  target: any,
  customizer?: (value: any) => any,
  ...sources: any
) {
  customizer ||= (value: any) => value

  for (const s of sources) {
    const source = toValue(s)
    for (const key in source) {
      // if (source[key] === undefined && key in target) {
      //   continue
      // }
      if (isPlainObjectOrArray(source[key])) {
        if (
          isPlainObjectOrArray(target[key]) &&
          getRawType(target[key]) === getRawType(toValue(source[key]))
        ) {
          if (isPlainObject(target[key])) {
            merge(target[key], customizer, source[key])
          } else {
            // target[key] = target[key].concat(customizer(source[key]))
          }
        } else {
          target[key] = customizer(source[key])
        }
      } else {
        target[key] = customizer(source[key])
      }
    }
  }
}

function isPlainObjectOrArray(value: unknown) {
  return isPlainObject(value) || isArray(value)
}
