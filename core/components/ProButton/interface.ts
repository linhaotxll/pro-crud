import type { DeepMaybeRef } from '@vueuse/core'
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
export type CustomActions = {
  [name: string]: MaybeRefOrGetter<ActionOption> | undefined
}

/**
 * 按钮组配置
 */
export type ActionGroupOption<
  T extends CustomActions = CustomActions,
  R = any
> = {
  /**
   * 是否显示按钮组
   *
   * @default true
   */
  show?: MaybeRefOrGetter<boolean>

  /**
   * 按钮间距配置
   */
  space?: DeepMaybeRef<SpaceProps>

  /**
   * 按钮列表
   */
  actions?: MaybeRefOrGetter<T & CustomActions>
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
export type ActionOption<C = any> = {
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
    onClick?: (e: PointerEvent, ctx: C) => void
  }

  /**
   * 顺序
   */
  order?: MaybeRefOrGetter<number>

  /**
   * 自定义渲染内容
   */
  render?: MaybeRefOrGetter<ProButtonRender<C>>

  /**
   * 点击按钮确认弹窗类型，false 则不需要
   *
   * @default false
   */
  confirmType?: MaybeRefOrGetter<false>
} & {
  /**
   * 点击按钮确认弹窗类型，popconfirm
   */
  confirmType?: MaybeRefOrGetter<'popconfirm'>

  /**
   * popconfirm 组件 props
   */
  confirmProps?: DeepMaybeRef<PopconfirmProps>
} & {
  /**
   * 点击按钮确认弹窗类型，modal
   */
  confirmType?: MaybeRefOrGetter<'modal'>

  /**
   * modal 组件 props
   */
  confirmProps?: DeepMaybeRef<ModalProps>
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
export type InternalProButtonOptions<C = any> = {
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
   * 自定义渲染函数
   */
  render?: ProButtonRender<C>

  /**
   * 作用域对象
   */
  ctx?: any

  /**
   * 点击按钮确认弹窗类型，false 则不需要
   */
  confirmType?: false
} & {
  confirmType?: 'popconfirm'
  confirmProps?: PopconfirmProps
} & {
  confirmType?: 'modal'
  confirmProps?: ModalProps
}

export type ProButtonRender<C = any> = (
  attrs: ButtonProps,
  ctx: C
) => VNodeChild

/**
 * Pro Button 确认弹窗类型
 */
export type ProButtonConfirmType = 'popconfirm' | 'modal' | false
