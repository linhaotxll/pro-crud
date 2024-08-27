import {
  App,
  message as _message,
  notification as _notification,
} from 'ant-design-vue'

import { isFunction, isString, isVueNode } from '../../utils'
import { mergeWithTovalue } from '../common'

import { getGlobalOptions } from '~/constant'

import type { ProButtonToastOptions } from './interface'

export function useToast(toast?: ProButtonToastOptions | null) {
  const { message } = App.useApp() ?? {
    message: _message,
  }

  const key = `${Date.now()}`

  function open(type: 'loading' | 'success' | 'error') {
    if (isFunction(toast)) {
      toast()
    } else if (toast) {
      let resolvedMessageProps
      if (isString(toast)) {
        resolvedMessageProps = { success: { content: toast } }
      } else {
        resolvedMessageProps = toast
      }

      mergeWithTovalue(resolvedMessageProps, getGlobalOptions().toast)

      const typeProps = resolvedMessageProps[type]

      if (typeProps) {
        let resolvedTytpeProps
        if (isVueNode(typeProps)) {
          resolvedTytpeProps = { content: typeProps }
        } else {
          resolvedTytpeProps = typeProps
        }

        message.open(
          mergeWithTovalue({}, resolvedMessageProps.props, resolvedTytpeProps, {
            key,
            type,
          })
        )
      }
    } else {
      close()
    }
  }

  function close() {
    if (!isFunction(toast) && toast) {
      message.destroy(key)
    }
  }

  return { open, close }
}
