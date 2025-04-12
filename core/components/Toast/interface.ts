import type { VueNode } from 'ant-design-vue/es/_util/type'
import type { ArgsProps } from 'ant-design-vue/es/message/interface'

type Fn = () => void

export type ToastTypeOptions =
  | VueNode
  | ArgsProps
  | { show: () => void | Fn }
  | false

export interface ToastOptions {
  loading?: ToastTypeOptions
  success?: ToastTypeOptions
  warning?: ToastTypeOptions
  info?: ToastTypeOptions
  error?: ToastTypeOptions
  config?: Omit<ArgsProps, 'content' | 'type'>
}
