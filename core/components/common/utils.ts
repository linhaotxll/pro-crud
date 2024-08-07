import { isPromise } from '~/utils'

import type { ToastOptions } from '../Toast'
import type { Ref } from 'vue'

const hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = (obj: any, key: PropertyKey) =>
  hasOwnProperty.call(obj, key)

export function genToast(content: string): ToastOptions {
  // @ts-ignore
  return { type: 'message', props: { title: content, message: content } }
}

export function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function findAndReplace(arr: any, item: any, value: any) {
  if (Array.isArray(arr)) {
    const index = arr.indexOf(item)
    if (index > -1) {
      arr = arr.slice()
      arr[index] = value
    }
  }

  return arr
}

export function fetchWithLoding<T = any>(
  loading: Ref<boolean>,
  request: () => Promise<T> | T,
  assign: (res: T) => void,
  onError?: (error: any) => void,
  onComplete?: () => void
) {
  // 是否是 Promise
  let isPromiseFetch = false

  try {
    // 开启 loading
    loading.value = true
    // 调用请求
    const result = request()

    if ((isPromiseFetch = isPromise(result))) {
      result
        .then(res => {
          // 赋值
          assign(res)
        })
        .catch(err => {
          onError?.(err)
        })
        .finally(() => {
          loading.value = false
          onComplete?.()
        })
    } else {
      // 赋值
      assign(result)
    }
  } catch (e) {
    onError?.(e)
  } finally {
    // 非 Promise 关闭 loading
    if (!isPromiseFetch) {
      loading.value = false
      onComplete?.()
    }
  }
}
