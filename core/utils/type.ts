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
