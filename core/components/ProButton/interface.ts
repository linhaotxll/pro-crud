import type { CustomRender } from './../CustomRender/interface'
import type { Arrayable } from '../common'
import type { DeepMaybeRef } from '@vueuse/core'
import type {
  ButtonProps,
  ModalProps,
  PopconfirmProps,
  PopoverProps,
  SpaceProps,
} from 'ant-design-vue'
import type { VueNode } from 'ant-design-vue/es/_util/type'
import type { ArgsProps as MessageArgsProps } from 'ant-design-vue/es/message/interface'
import type { AllowedComponentProps, MaybeRefOrGetter } from 'vue'

/**
 * 自定义按扭
 */
export type CustomActions = {
  [name: string]: MaybeRefOrGetter<ActionOption> | undefined
}

/**
 * 按钮组配置
 */
export type ActionGroupOption<T = CustomActions, R = any> = {
  /**
   * 是否显示按钮组
   *
   * @default true
   */
  show?: MaybeRefOrGetter<boolean>

  /**
   * 按钮间距配置
   */
  space?: DeepMaybeRef<SpaceProps & AllowedComponentProps>

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
export type ActionOption<C extends object = any> = CustomRender<
  ProButtonRenderParams<ButtonProps, C>
> & {
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
  props?: MaybeRefOrGetter<DeepMaybeRef<Omit<ButtonProps, 'onClick'>>> & {
    onClick?: Arrayable<(e: PointerEvent, ctx: C) => void>
  }

  /**
   * toast 提示
   */
  toast?: MaybeRefOrGetter<ProButtonToastOptions | null>

  /**
   * 顺序
   */
  order?: MaybeRefOrGetter<number>

  /**
   * 点击按钮确认弹窗类型，false 则不需要
   *
   * @default false
   */
  confirmType?: MaybeRefOrGetter<false | 'popconfirm' | 'modal'>

  /**
   * popconfirm 组件 props
   */
  confirmProps?:
    | MaybeRefOrGetter<ProButtonConformModalProps<C>>
    | MaybeRefOrGetter<ProButtonConformPopoverProps<C>>
}

export type ProButtonConformModalProps<C extends object = any> = Omit<
  ModalProps,
  'onOk'
> & {
  onOk?: (e: PointerEvent, ctx: C) => void
}

export type ProButtonConformPopoverProps<C extends object = any> = Omit<
  PopoverProps,
  'onConfirm'
> & {
  onConfirm?: (e: PointerEvent, ctx: C) => void
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
export type InternalProButtonOptions<C extends object = any> = {
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
   * toast 提示
   */
  toast?: ProButtonToastOptions | null

  /**
   * 点击按钮确认弹窗类型，false 则不需要
   */
  confirmType?: false
} & {
  confirmType?: 'popconfirm'
  confirmProps?: PopconfirmProps
  confirmRender?: ProButtonRenderParams<PopoverProps, C>
} & {
  confirmType?: 'modal'
  confirmProps?: ModalProps
  confirmRender?: ProButtonRenderParams<ModalProps, C>
} & CustomRender<ProButtonRenderParams<ButtonProps, C>>

export type ProButtonToastOptions =
  | (() => void)
  | string
  | ProButtonToastObjectOption

export type ProButtonToastObjectOption = {
  props?: Omit<MessageArgsProps, 'content' | 'icon'>
  loading?: VueNode | Pick<MessageArgsProps, 'content' | 'icon'>
  success?: VueNode | Pick<MessageArgsProps, 'content' | 'icon'>
  error?: VueNode | Pick<MessageArgsProps, 'content' | 'icon'>
}

export type ProButtonRenderParams<
  Props = ButtonProps,
  Context extends object = any
> = {
  props: Props
} & {
  [K in keyof Context]: Context[K]
}

/**
 * Pro Button 确认弹窗类型
 */
export type ProButtonConfirmType = 'popconfirm' | 'modal' | false
