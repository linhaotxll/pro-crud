import type { DataObject } from '../common'
import type {
  ActionGroupOption,
  ActionOption,
  InternalProButtonGroupOptions,
} from '../ProButton'
import type {
  BuildFormBinding,
  BuildFormOptionResult,
  ProFormScope,
} from '../ProForm/interface'
import type { DeepMaybeRef } from '@vueuse/core'
import type { ModalProps } from 'ant-design-vue'
import type { ComputedRef, MaybeRefOrGetter, VNodeChild } from 'vue'

/**
 * 渲染打开弹窗的 DOM 函数
 */
export type RenderTrigger = (() => VNodeChild) | false

export interface BuildModalFormOptionReturn<
  Data extends DataObject = DataObject,
  R = Data,
  Collection = any
> {
  /**
   * 渲染触发打开 Modal 的 DOM
   */
  renderTrigger?: RenderTrigger

  /**
   * 是否打开
   */
  open?: MaybeRefOrGetter<boolean>

  /**
   * 弹窗 Props
   */
  modalProps?: MaybeRefOrGetter<Omit<DeepMaybeRef<ModalProps>, 'footer'>>

  /**
   * 表单配置
   */
  form?: Omit<BuildFormOptionResult<Data, R, Collection>, 'action'>

  /**
   * 按钮组
   */
  submitter?: MaybeRefOrGetter<false | ModalFormActionGroup>
}

/**
 * Mdoal Form 按钮组
 */
export type ModalFormActionGroup<C = any> = ActionGroupOption<
  ModalFormActions<C>,
  {}
>

/**
 * Pro Table 列按钮
 */
export interface ModalFormActions<C = any> {
  /**
   * 确认按钮
   */
  ok?: MaybeRefOrGetter<ActionOption<C>>

  /**
   * 取消按钮
   */
  cancel?: MaybeRefOrGetter<ActionOption<C>>

  /**
   * 自定义按钮
   */
  [name: string]: MaybeRefOrGetter<ActionOption<C>> | undefined
}

/**
 * Modal Form 作用域
 */
export interface ModalFormScope<Data extends DataObject = DataObject>
  extends ProFormScope<Data> {
  /**
   * 打开弹窗
   */
  showModal(): void

  /**
   * 关闭弹窗
   */
  hideModal(): void
}

/**
 * Modal Form Binding
 */
export interface ModalFormBinding<FormState extends DataObject = DataObject> {
  modalProps: ComputedRef<ModalProps>
  formBinding: BuildFormBinding<FormState>
  modalAction: ComputedRef<false | InternalProButtonGroupOptions>
  renderTrigger: RenderTrigger
}

/**
 * buildModalForm 返回值
 */
export interface BuildModalFormResult<
  FormState extends DataObject = DataObject
> {
  modalFormBinding: ModalFormBinding<FormState>
}
