import { createFetch, toValue } from '@vueuse/core'
import { merge } from 'lodash-es'
import qs from 'query-string'
import { computed, type ComputedRef, type MaybeRef, type Ref } from 'vue'

import type { UseFetchOptions, UseFetchReturn } from '@vueuse/core'

export type FetchOptions<T = any> = Omit<UseFetchOptions, 'url'> & {
  query?: T extends null ? null : MaybeRef<T>
  body?: T extends null ? null : MaybeRef<T>
  params?: MaybeRef<string>
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'
  transformData?: (data: T) => T
}

type FetchHook = (...args: any[]) => any

export type InputOptions<T> = Ref<T> | ComputedRef<T> | T

export type NoInputFetchOptions = Omit<FetchOptions, 'body' | 'params'>

const fetch = createFetch({
  baseUrl: ``,

  options: {
    timeout: 1000 * 10, // 10s
    refetch: true,
    immediate: false,
  },
})

function _useFetch<R>(
  url: MaybeRef<string>,
  options: FetchOptions = {},
  beforeFetch: UseFetchOptions['beforeFetch'],
  afterFetch: UseFetchOptions['afterFetch'],
  onFetchError: UseFetchOptions['onFetchError']
) {
  const result = fetch<R>(url, {
    ...options,

    beforeFetch(ctx) {
      ctx.options.headers = {
        Authorization: `Bearer `,
      }
      // 优先调用额外的 beforeFetch 钩子函数，没有直接返回结果
      return beforeFetch?.(ctx)
    },

    async afterFetch(ctx) {
      const code = ctx.data?.code ?? 200

      // 返回 afterFetch 链式调用结果
      const chainAfterFetch = () => {
        return afterFetch ? afterFetch(ctx) : ctx
      }

      // 权限过期
      if (code === 401) {
        ctx.data = null
        const error: any = new Error('登录失效')
        error.code = 401
        throw error
      }

      if (!(code >= 200 && code < 300)) {
        const errMsg: string = ctx.data?.msg ?? '系统错误'
        ctx.data = null
        remove()
        throw new Error(errMsg)
      } else if (ctx.data) {
        if (typeof options.transformData === 'function') {
          ctx.data = options.transformData(ctx.data)
        } else if (Object.prototype.hasOwnProperty.call(ctx.data, 'rows')) {
          ctx.data = ctx.data as any
        } else if (Object.prototype.hasOwnProperty.call(ctx.data, 'data')) {
          ctx.data = (ctx.data as any).data as any
        }
      }

      // 请求成功将当前请求移除集合
      remove()

      return chainAfterFetch()
    },

    onFetchError(ctx) {
      // debugger
      ctx.data = Object.prototype.hasOwnProperty.call(options, 'initialData')
        ? options.initialData
        : ctx.data

      // 请求失败将当前请求移除集合
      remove()

      // 优先调用额外的 onFetchError 钩子函数, 没有直接返回结果
      return onFetchError ? onFetchError(ctx) : ctx
    },
  })

  // 将请求从集合中移除
  function remove() {
    //
  }

  return result
}

function isPromise(value: any): value is Promise<any> {
  return (
    value &&
    typeof value.then === 'function' &&
    typeof value.catch === 'function'
  )
}

function combineCallbacks(
  callbacks: ((ctx: any) => any)[]
): FetchHook | undefined {
  if (callbacks.length) {
    if (callbacks.length > 1) {
      return (ctx: any) => {
        callbacks.reduce((prevCallback, callback) => {
          return prevCallback.then(() => {
            const cb = callback(ctx)
            if (isPromise(cb)) {
              return cb.then(res => merge(ctx, res))
            } else {
              ctx = merge(ctx, cb)
            }
          })
        }, Promise.resolve())
        return ctx
      }
    } else {
      return callbacks[0]
    }
  }
}

function createRequest<R>(
  url: MaybeRef<string>,
  method: 'get' | 'post' | 'put' | 'delete',
  ...options: FetchOptions[]
) {
  // 记录多个钩子函数
  const hookMap: any = {
    beforeFetch: [],
    afterFetch: [],
    onFetchError: [],
  }

  // 合并非钩子配置
  const resultOptions: FetchOptions = options.reduce<FetchOptions>(
    (prev, curr) => {
      Object.keys(curr).forEach(key => {
        if (hookMap[key]) {
          hookMap[key].push(curr[key])
        } else {
          prev[key] = curr[key]
        }
      })
      return prev
    },
    {}
  )

  // 合并钩子配置
  const beforeEach = combineCallbacks(hookMap.beforeFetch)
  const afterFetch = combineCallbacks(hookMap.afterFetch)
  const onFetchError = combineCallbacks(hookMap.onFetchError)

  const request = _useFetch<R>(
    resultOptions.query || resultOptions.params
      ? computed(
          () =>
            `${url}${
              resultOptions.params ? `/${toValue(resultOptions.params)}` : ''
            }${
              resultOptions.query
                ? `?${qs.stringify(toValue(resultOptions.query!))}`
                : ''
            }`
        )
      : url,

    resultOptions,
    beforeEach,
    afterFetch,
    onFetchError
  )

  const methodRequest = request[method](resultOptions.body)

  return methodRequest[
    resultOptions.responseType || 'json'
  ]<R>() as unknown as UseFetchReturn<R>
}

export function usePost<T>(url: MaybeRef<string>, ...options: FetchOptions[]) {
  return createRequest<T>(url, 'post', ...options)
}

export function useGet<R>(url: MaybeRef<string>, ...options: FetchOptions[]) {
  return createRequest<R>(url, 'get', ...options)
}

export function useDelete<T>(
  url: MaybeRef<string>,
  ...options: FetchOptions[]
) {
  return createRequest<T>(url, 'delete', ...options)
}

export function usePut<T>(url: MaybeRef<string>, ...options: FetchOptions[]) {
  return createRequest<T>(url, 'put', ...options)
}

export interface UseRequest<T, R> {
  (options: FetchOptions<T>): UseFetchReturn<R>
}
