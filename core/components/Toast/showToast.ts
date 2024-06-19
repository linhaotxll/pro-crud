import {
  App,
  message as _message,
  notification as _notification,
} from 'ant-design-vue'

import { isFunction, isString } from '../../utils'
import { mergeWithTovalue } from '../common'

import type { ToastOptions } from './interface'
import type { ArgsProps } from 'ant-design-vue/es/message/interface'
import type { NotificationArgsProps } from 'ant-design-vue/es/notification'

const { message, notification } = App.useApp() ?? {
  message: _message,
  notification: _notification,
}

/**
 * 默认 message 配置
 */
const defaultToastProps: ArgsProps = { type: 'success', content: '' }

/**
 * 默认 notification 配置
 */
const defaultNotificationProps: NotificationArgsProps = {
  type: 'success',
  message: '',
}

export function showToast(toast?: ToastOptions) {
  if (toast === false || !toast) {
    return
  }

  if (isFunction(toast)) {
    return toast()
  }

  if (isString(toast)) {
    toast = {
      type: 'message',
      props: {
        content: toast,
      },
    }
  }

  if (toast.type === 'message') {
    message.open(mergeWithTovalue({}, defaultToastProps, toast.props))
  } else if (toast.type === 'notification') {
    notification.open(
      mergeWithTovalue({}, defaultNotificationProps, toast.props)
    )
  }
}
