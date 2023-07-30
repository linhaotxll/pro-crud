const hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = (obj: any, key: PropertyKey) =>
  hasOwnProperty.call(obj, key)
