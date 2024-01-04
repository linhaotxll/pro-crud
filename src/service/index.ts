import { useFetch } from '@vueuse/core'

import type { FetchOptions, UseRequest } from '../utils/fetch'
import type { UseFetchOptions } from '@vueuse/core'

export const useCashierUserOpen = ({
  beforeFetch,
  afterFetch,
  ...rest
}: UseFetchOptions) => {
  const opt: UseFetchOptions = {
    ...rest,
    beforeFetch(ctx) {
      try {
        ctx.options.headers = {
          Authorization: `Bearer `,
        }
        return beforeFetch?.(ctx) ?? ctx
      } catch (e) {
        console.log(1, e)
      }
      return ctx
    },
    afterFetch(ctx) {
      try {
        return afterFetch?.(ctx) ?? ctx
      } catch (e) {
        console.log(1, e)
      }
      return ctx
    },
    onFetchError(ctx) {
      // debugger
      return ctx
    },
  }

  return useFetch('/system/jygl/getCashierUserOpen', opt).post().json()
}

export const fetchCashierUserOpen = promisify(useCashierUserOpen)

function promisify<T, R>(useService: UseRequest<T, R>) {
  return function (options?: FetchOptions<T>) {
    return new Promise<R>((resolve, reject) => {
      const fetchOptions: FetchOptions<T> = {
        ...options,
        immediate: true,
        afterFetch(ctx) {
          // debugger
          resolve(ctx.data)
          return ctx
        },

        onFetchError(ctx) {
          // debugger
          reject(ctx.error)
          return ctx
        },
      }

      useService(fetchOptions)
    })
  }
}
