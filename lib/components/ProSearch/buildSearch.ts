import { buildForm } from '../ProForm'

import type {
  ProSearchOptions,
  ProSearchScope,
  UseSearchReturn,
} from './interface'

export function buildSearch<T extends object, C = undefined, R = T>(
  options: (
    scope: ProSearchScope<T>,
    ctx?: C | undefined
  ) => ProSearchOptions<T, R>
): UseSearchReturn<T, R>
export function buildSearch<T extends object, C, R = T>(
  options: (scope: ProSearchScope<T>, ctx: C) => ProSearchOptions<T, R>,
  context: C
): UseSearchReturn<T, R>

export function buildSearch<T extends object, C, R = T>(
  options: (scope: ProSearchScope<T>, ctx?: C) => ProSearchOptions<T, R>,
  ctx?: C
): UseSearchReturn<T, R> {
  const { proFormRef, formBinding } = buildForm(options, ctx)
  return {
    proSearchRef: proFormRef,
    searchBinding: formBinding,
  }
}
