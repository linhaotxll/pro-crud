import type { DataObject } from '../common'
import type { ActionGroupOption, ActionOption } from '../ProButton'
import type { BuildFormOptionResult } from '../ProForm/interface'
import type { ModalProps } from 'ant-design-vue'
import type { MaybeRefOrGetter, VNodeChild } from 'vue'

export interface BuildModalFormOptionReturn<
  Data extends DataObject = DataObject,
  R = Data,
  Collection = any
> {
  /**
   * 渲染触发打开 Modal 的 DOM
   */
  renderTrigger?: () => VNodeChild

  /**
   * 是否打开
   */
  open?: MaybeRefOrGetter<boolean>

  /**
   * 弹窗 Props
   */
  modalProps?: MaybeRefOrGetter<Omit<ModalProps, 'open'>>

  /**
   * 表单配置
   */
  form?: MaybeRefOrGetter<
    Omit<BuildFormOptionResult<Data, R, Collection>, 'action'>
  >

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
