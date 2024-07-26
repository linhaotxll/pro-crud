import { isRef, isVNode, toValue, unref } from 'vue'

import { isArray, isFunction, isNil, isPlainObject } from '~/utils'

export function mergeWithTovalue<T = any>(target: any, ...source: any[]): T {
  merge(target, ...source)
  return target
}

export function mergeWithNoUnref<T = any>(target: any, ...source: any[]): T {
  merge2(target, ...source)
  return target
}

export function merge(target: any, ...sources: any) {
  for (const source of sources) {
    const sourceValue = toValue(source)
    if (isNil(sourceValue)) {
      continue
    }

    const sourceValueIgnore = isIgnore(sourceValue)
    const sourceValueKeys = Object.keys(sourceValue)
    for (const key of sourceValueKeys) {
      const resolveSourceValue = unref(sourceValue[key])
      if (isFunction(resolveSourceValue)) {
        target[key] = resolveSourceValue
      } else {
        const value = toValue(sourceValue[key])
        if (sourceValueIgnore || isIgnore(value)) {
          target[key] = value
          continue
        }
        if (isPlainObject(value)) {
          merge(
            (target[key] = isPlainObject(target[key]) ? target[key] : {}),
            value
          )
        } else if (isArray(value)) {
          merge((target[key] = isArray(target[key]) ? target[key] : []), value)
        } else {
          target[key] = value
        }
      }
    }
  }

  return target
}

export function merge2(target: any, ...sources: any) {
  for (const source of sources) {
    const sourceValue = toValue(source)
    if (isNil(sourceValue)) {
      continue
    }

    const sourceValueIgnore = isIgnore(sourceValue)
    const sourceValueKeys = Object.keys(sourceValue)
    for (const key of sourceValueKeys) {
      const resolveSourceValue = sourceValue[key]
      if (isFunction(resolveSourceValue)) {
        target[key] = resolveSourceValue
      } else {
        const value = sourceValue[key]
        if (sourceValueIgnore || isIgnore(value)) {
          target[key] = value
          continue
        }
        if (isVNode(value) || isRef(value)) {
          target[key] = value
        } else if (isPlainObject(value)) {
          merge2(
            (target[key] = isPlainObject(target[key]) ? target[key] : {}),
            value
          )
        } else if (isArray(value)) {
          merge2((target[key] = isArray(target[key]) ? target[key] : []), value)
        } else {
          target[key] = value
        }
      }
    }
  }

  return target
}

const IgnoreKey = Symbol('ignore merge key')

export function isIgnore(value: any) {
  return isNil(value) ? true : !!value[IgnoreKey]
}

export function markIgnoreMerge(value: unknown) {
  if (isPlainObject(value) || isArray(value)) {
    Object.defineProperty(value, IgnoreKey, {
      value: true,
      configurable: false,
      enumerable: false,
    })
  }
}
