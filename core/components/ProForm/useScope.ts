import { ProFormInstanceNames } from './constant'

import type { ProFormInstance, ProFormScope } from './interface'

export function useScope<T extends object>(
  getValues: () => T,
  getCtx: () => ProFormInstance<T>
) {
  const scope = ProFormInstanceNames.reduce((prev, curr) => {
    // @ts-ignore
    prev[curr] = (...args: unknown[]) => getCtx()[curr](...args)
    return prev
  }, {} as ProFormScope<T>)

  scope.getFormValues = getValues

  scope.resetFields = prop => scope.reset(prop)

  return scope
}
