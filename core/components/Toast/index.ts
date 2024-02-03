import {
  message as _message,
  notification as _notification,
  type MessageArgsProps,
  App,
} from 'ant-design-vue'
import { merge } from 'lodash-es'

import type { NotificationArgsProps } from 'ant-design-vue/es/notification'

export type SuccessToastOptions =
  | false
  | string
  | {
      type: 'message'
      props?: MessageArgsProps
    }
  | {
      type: 'notification'
      props?: NotificationArgsProps
    }

const DefaultSuccessToastOptions = { type: 'message' }

const { message, notification } = App.useApp() ?? {
  message: _message,
  notification: _notification,
}

export function showToast(
  toast?: SuccessToastOptions,
  defaultToast?: SuccessToastOptions,
  type: 'info' | 'success' | 'error' | 'warning' = 'success'
) {
  if (toast !== false) {
    const content = typeof toast === 'string' ? toast : undefined
    const mergeToast = merge(
      {},
      defaultToast,
      content ? { props: { content, message: content } } : undefined,
      DefaultSuccessToastOptions,
      content ? undefined : toast
    )
    if (mergeToast.type === 'message') {
      // @ts-ignore
      message[type](mergeToast.props.message)
    } else if (mergeToast.type === 'notification') {
      notification[type](mergeToast.props)
    }
  }
}
