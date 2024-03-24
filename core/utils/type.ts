const toString = Object.prototype.toString
const toType = (value: unknown): string => toString.call(value)
const toRawType = (value: unknown) => toType(value).slice(8, -1)

export const isPromise = (value: unknown): value is Promise<any> =>
  toRawType(value) === 'Promise'
