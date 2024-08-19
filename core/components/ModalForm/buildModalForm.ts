import { computed, ref, toValue, unref, watch } from 'vue'

import {
  buildDefaultRenderTrigger,
  buildModalFormDefaultAction,
  defaultModalFormOption,
} from './constant'

import { isBoolean } from '../../utils'
import { mergeWithTovalue, type DataObject } from '../common'
import { buildButtonGroup } from '../ProButton'
import { buildForm } from '../ProForm'

import type {
  BuildModalFormOptionReturn,
  ModalFormBinding,
  ModalFormScope,
  RenderTrigger,
} from './interface'
import type { InternalProButtonGroupOptions } from '../ProButton'
import type { ModalProps } from 'ant-design-vue'
import type { ComputedRef } from 'vue'

export function buildModalForm<
  FormState extends DataObject = DataObject,
  R extends DataObject = FormState,
  Collection = any
>(
  options: (
    scope: ModalFormScope<FormState>
  ) => BuildModalFormOptionReturn<FormState, R, Collection>
) {
  // 解析 Modal Props
  let resolvedModalProps!: ComputedRef<ModalProps>

  // 解析弹窗按钮组
  let resolvedModalAction!: ComputedRef<InternalProButtonGroupOptions | false>

  // 渲染触发打开 Modal 的 DOM
  let renderTrigger!: RenderTrigger

  // 弹窗打开状态
  const internalOpen = ref(false)

  const { proFormBinding } = buildForm<FormState, R>(scope => {
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
      scope.reset()
    }

    const modalFormScope: ModalFormScope<FormState> = {
      ...scope,
      showModal,
      hideModal,
    }

    const {
      modalProps,
      renderTrigger: renderTriggerButton = {
        render: () => buildDefaultRenderTrigger(modalFormScope),
      },
      submitter,
      form,
    } = options(modalFormScope)

    // 合并 Modal Props
    resolvedModalProps = computed<ModalProps>(() =>
      mergeWithTovalue({ onCancel: hideModal }, toValue(modalProps), {
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

    const result = mergeWithTovalue(
      {
        toast: '保存成功',
        ...toValue(form),
        successRequest(values: any) {
          hideModal()
          modalFormScope.reset()
          unref(form?.successRequest)?.(values)
        },
      },

      defaultModalFormOption
    )

    return result
  })

  const modalFormBinding: ModalFormBinding = {
    modalProps: resolvedModalProps,
    formBinding: proFormBinding,
    modalAction: resolvedModalAction,
    renderTrigger,
  }

  return {
    modalFormBinding,
  }
}
