import type { DeepMaybeRefOrGetter } from '../common'
import type {
  ButtonProps,
  ModalProps,
  PopconfirmProps,
  SpaceProps,
} from 'ant-design-vue'
import type { MaybeRefOrGetter, VNodeChild } from 'vue'

/**
 * 自定义按扭
 */
export type CustomActions = Record<string, MaybeRefOrGetter<ActionOption>>

/**
 * 按钮组配置
 */
export type ActionGroupOption<T extends CustomActions, R = any> = {
  /**
   * 是否显示按钮组
   *
   * @default true
   */
  show?: MaybeRefOrGetter<boolean>

  /**
   * 按钮间距配置
   */
  space?: DeepMaybeRefOrGetter<SpaceProps>

  /**
   * 按钮列表
   */
  actions?: MaybeRefOrGetter<T>
} & R

/**
 * 按扭列表配制
 */
export type ActionsList<T extends CustomActions> = {
  /**
   * 其余按钮
   */
  [type: string]: MaybeRefOrGetter<ActionOption> | undefined
} & {
  [P in keyof T]: T[P]
}

/**
 * 按钮配置
 */
export interface ActionOption<C = any> {
  /**
   * 是否显示
   *
   * @default true
   */
  show?: MaybeRefOrGetter<boolean>

  /**
   * 按钮文本
   */
  text?: MaybeRefOrGetter<string>

  /**
   * 按钮 props
   */
  props?: MaybeRefOrGetter<DeepMaybeRefOrGetter<ButtonProps>>

  /**
   * 顺序
   */
  order?: MaybeRefOrGetter<number>

  /**
   * 点击按钮确认弹窗类型，false 则不需要
   *
   * @default false
   */
  confirmType?: MaybeRefOrGetter<ProButtonConfirmType>

  /**
   * 确认弹窗 props
   */
  confirmProps?: MaybeRefOrGetter<
    DeepMaybeRefOrGetter<PopconfirmProps> | DeepMaybeRefOrGetter<ModalProps>
  >

  /**
   * 自定义渲染内容
   */
  render?: MaybeRefOrGetter<(ctx: C) => VNodeChild>
}

/**
 * 内部使用 ProButtonGroup 类型
 */
export interface InternalProButtonGroupOptions {
  /**
   * 是否显示
   */
  show: boolean

  /**
   * Space 配制
   */
  space?: SpaceProps

  /**
   * 按扭列表
   */
  actions?: InternalProButtonOptions[]
}

/**
 * 内部使用按扭配制
 */
export interface InternalProButtonOptions<C = any> {
  /**
   * 是否显示按扭
   */
  show: boolean

  /**
   * 按扭文本
   */
  text?: string

  /**
   * 按扭 Props
   */
  props?: ButtonProps

  /**
   * 按扭顺序
   */
  order?: number

  /**
   * 点击按钮确认弹窗类型，false 则不需要
   */
  confirmType?: ProButtonConfirmType

  /**
   * 确认弹窗 props
   */
  confirmProps?: PopconfirmProps | ModalProps

  /**
   * 自定义渲染函数
   */
  render?: (ctx?: C) => VNodeChild

  /**
   * 作用域对象
   */
  ctx?: any
}

/**
 * Pro Button 确认弹窗类型
 */
export type ProButtonConfirmType = 'popconfirm' | 'modal' | false
