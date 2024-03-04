import type { ExtractMaybeRef, MaybeRef, ValueOf } from '../common'
import type {
  ButtonProps,
  ModalProps,
  PopconfirmProps,
  SpaceProps,
} from 'ant-design-vue'
import type { VNodeChild } from 'vue'

/**
 * 按钮组配置
 */
export interface ActionGroupOption<
  T extends Record<string, MaybeRef<ActionOption>>
> {
  /**
   * 是否显示按钮组
   *
   * @default true
   */
  show?: MaybeRef<boolean>

  /**
   * 按钮间距配置
   */
  space?: ExtractMaybeRef<SpaceProps>

  /**
   * 按钮列表
   */
  actions?: MaybeRef<ActionsList<T>>
}

/**
 * 按扭列表配制
 */
export type ActionsList<T extends Record<string, MaybeRef<ActionOption>>> = {
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
  text?: MaybeRef<string>

  /**
   * 按钮 props
   */
  props?: MaybeRef<ExtractMaybeRef<ButtonProps>>

  /**
   * 顺序
   */
  order?: MaybeRef<number>

  /**
   * 点击按钮确认弹窗类型，false 则不需要
   *
   * @default false
   */
  confirmType?: MaybeRef<ProButtonConfirmType>

  /**
   * 确认弹窗 props
   */
  confirmProps?: MaybeRef<
    ExtractMaybeRef<PopconfirmProps> | ExtractMaybeRef<ModalProps>
  >

  /**
   * 自定义渲染内容
   */
  render?: MaybeRef<() => VNodeChild>
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
export interface InternalProButtonOptions {
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
  render?: () => VNodeChild
}

/**
 * Pro Button 确认弹窗类型
 */
export type ProButtonConfirmType = 'popconfirm' | 'modal' | false
