import { computed, ref, toValue, watch } from 'vue'

import {
  buildDefaultRenderTrigger,
  buildModalFormDefaultAction,
  defaultModalFormOption,
} from './constant'

import { isBoolean } from '../../utils'
import { mergeWithTovalue, type DataObject } from '../common'
import { buildButtonGroup } from '../ProButton'
import { buildForm } from '../ProForm'

import type { BuildModalFormOptionReturn, ModalFormScope } from './interface'
import type { InternalProButtonGroupOptions } from '../ProButton'
import type { ModalProps } from 'ant-design-vue'
import type { ComputedRef, VNodeChild } from 'vue'

export function buildModalForm<
  Data extends DataObject = DataObject,
  R extends DataObject = Data,
  Collection = any
>(
  options: (
    scope: ModalFormScope<Data>
  ) => BuildModalFormOptionReturn<Data, R, Collection>
) {
  // 解析 Modal Props
  let resolvedModalProps!: ComputedRef<ModalProps>

  // 解析弹窗按钮组
  let resolvedModalAction!: ComputedRef<InternalProButtonGroupOptions | false>

  // 渲染触发打开 Modal 的 DOM
  let renderTrigger!: () => VNodeChild

  // 弹窗打开状态
  const internalOpen = ref(false)

  const { proFormBinding } = buildForm<Data, R>(scope => {
    const modalFormScope: ModalFormScope<Data> = {
      ...scope,
      showModal,
      hideModal,
    }

    const {
      modalProps,
      renderTrigger: renderTriggerButton = () =>
        buildDefaultRenderTrigger(modalFormScope),
      submitter,
      form,
    } = options(modalFormScope)

    // 合并 Modal Props
    resolvedModalProps = computed<ModalProps>(() =>
      mergeWithTovalue({ onCancel: hideModal }, modalProps, {
        open: toValue(internalOpen),
      })
    )

    watch(
      () => toValue(toValue(modalProps)?.open),
      visible => {
        if (isBoolean(visible)) {
          if (visible) {
            showModal()
          } else {
            hideModal()
          }
        }
      }
    )

    // 合并弹窗按钮组
    resolvedModalAction = computed<InternalProButtonGroupOptions | false>(
      () => {
        const submitterValue = toValue(submitter)
        if (submitterValue === false) {
          return false
        }

        return buildButtonGroup(
          mergeWithTovalue(
            {},
            buildModalFormDefaultAction(modalFormScope),
            submitterValue
          )
        ).value
      }
    )

    renderTrigger = renderTriggerButton

    return mergeWithTovalue(
      {
        successRequest() {
          hideModal()
          modalFormScope.reset()
        },
        toast: '保存成功',
      },
      toValue(form),
      defaultModalFormOption
    )
  })

  /**
   * 打开弹窗
   */
  function showModal() {
    internalOpen.value = true
  }

  /**
   * 关闭弹窗
   */
  function hideModal() {
    internalOpen.value = false
  }

  const modalFormBinding = {
    modalProps: resolvedModalProps,
    formBinding: proFormBinding,
    modalAction: resolvedModalAction,
    renderTrigger,
  }

  return {
    modalFormBinding,
  }
}
