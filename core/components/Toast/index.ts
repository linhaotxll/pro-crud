import {
  message as _message,
  notification as _notification,
  App,
} from 'ant-design-vue'
import { merge } from 'lodash-es'

import { isString } from '~/utils'

import type { ArgsProps as MessageArgsProps } from 'ant-design-vue/es/message/interface'
import type { NotificationArgsProps } from 'ant-design-vue/es/notification'

export type SuccessToastOptions =
  | false
  | string
  | {
      type: 'message'
      props: MessageArgsProps
    }
  | {
      type: 'notification'
      props: NotificationArgsProps
    }

const DefaultSuccessMessageOptions: {
  type: 'message'
  props: MessageArgsProps
} = {
  type: 'message',
  props: {
    content: undefined,
    type: 'success',
  },
}

const DefaultSuccessNotificationOptions: {
  type: 'notification'
  props: NotificationArgsProps
} = {
  type: 'notification',
  props: {
    message: undefined,
    type: 'success',
  },
}

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
      DefaultSuccessMessageOptions,
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

export function toast(config?: SuccessToastOptions) {
  if (config === false) {
    return
  }

  let defaultConfig: SuccessToastOptions | undefined = config
  if (isString(defaultConfig)) {
    defaultConfig = merge(
      { props: { content: config } },
      DefaultSuccessMessageOptions
    )
  }

  if (defaultConfig) {
    if (defaultConfig.type === 'message') {
      message.open(
        merge({}, DefaultSuccessMessageOptions.props, defaultConfig.props)
      )
    } else {
      notification.open(
        merge({}, DefaultSuccessNotificationOptions.props, defaultConfig.props)
      )
    }
  }
}
