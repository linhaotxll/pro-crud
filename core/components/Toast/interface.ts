import type { ArgsProps as MessageArgsProps } from 'ant-design-vue/es/message/interface'
import type { NotificationArgsProps } from 'ant-design-vue/es/notification'

/**
 * 提示配置
 */
export type ToastOptions =
  | false
  | string
  | (() => void)
  | {
      type: 'message'
      props: MessageArgsProps
    }
  | {
      type: 'notification'
      props: NotificationArgsProps
    }
