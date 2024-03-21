import type { JSXElement, ValueOf } from '../common'
import type { ButtonProps, ModalProps, PopconfirmProps } from 'ant-design-vue'
import type { MaybeRef } from 'vue'

/**
 * 按钮组配置
 */
export interface ActionsOption<T = Record<string, ActionOption>> {
  /**
   * 是否显示按钮组
   *
   * @default true
   */
  show?: MaybeRef<boolean>

  /**
   * 按钮间距配置
   */
  space?: MaybeRef<number>

  /**
   * 按钮列表
   */
  list?: ActionsList<T>
}

export type ActionsList<T = Record<string, ActionOption>> = {
  /**
   * 其余按钮
   */
  [type: string]: ValueOf<T> | undefined
} & {
  [P in keyof T]: T[P]
}

/**
 * 按钮配置
 */
export interface ActionOption {
  /**
   * 是否显示
   *
   * @default trues
   */
  show?: MaybeRef<boolean>

  /**
   * 按钮文本
   */
  text?: string

  /**
   * 按钮 props
   */
  props?: ButtonProps

  /**
   * 顺序
   */
  order?: MaybeRef<number>

  /**
   * 点击按钮确认弹窗类型，false 则不需要
   *
   * @default false
   */
  confirmType?: 'popconfirm' | 'modal' | false

  /**
   * 确认弹窗 props
   */
  confirmProps?: ActionConfirmProps | ActionModalProps

  /**
   * 自定义渲染内容
   */
  render?: (...args: any[]) => JSXElement

  /**
   * 自定义渲染作用域
   */
  ctx?: any
}

/**
 * Popconfirm props，onConfirm 事件多了一个参数：行数据
 */
export type ActionConfirmProps = PopconfirmProps

/**
 * MessageBox props，callback 多了一个参数：行数据
 */
export type ActionModalProps = ModalProps
