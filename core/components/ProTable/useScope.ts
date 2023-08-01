import { ProTableInstanceNames } from './constant'

import type { ProTableInstance, ProTableScope } from './interface'
import type { Ref } from 'vue'

export function useScope<T extends object>(
  getCtx: () => Ref<ProTableInstance<T> | null>
) {
  const scope = ProTableInstanceNames.reduce((prev, curr) => {
    // @ts-ignore
    prev[curr] = (...args) => {
      // @ts-ignore
      return getCtx().value![curr](...args)
    }
    return prev
  }, {} as ProTableScope<T>)

  return scope
}
