import { isVNode } from 'vue'

import type { VueNode } from 'ant-design-vue/es/_util/type'

const toString = Object.prototype.toString
const toType = (value: unknown): string => toString.call(value)
const toRawType = (value: unknown) => toType(value).slice(8, -1)

export const isPromise = (value: unknown): value is Promise<any> =>
  toRawType(value) === 'Promise'

export const isArray = Array.isArray

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value: unknown): value is Function =>
  typeof value === 'function'

export const isString = (value: unknown): value is string =>
  typeof value === 'string'

export const isUndefined = (value: unknown): value is undefined =>
  typeof value === 'undefined'

export const isNull = (value: unknown): value is null => value === null

export const isPlainObject = (value: unknown): value is Record<string, any> =>
  toRawType(value) === 'Object'

export const isNil = (value: unknown): value is undefined | null =>
  isUndefined(value) || isNull(value)

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean'

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number'

export const isVueNode = (value: unknown): value is VueNode =>
  isVNode(value) ||
  isArray(value) ||
  isString(value) ||
  isBoolean(value) ||
  isNumber(value) ||
  isNil(value)
