import { Modal, type ModalProps } from 'ant-design-vue'
import { defineComponent, toValue } from 'vue'

import { buildCustomRender } from '../CustomRender'
import { ProButtonGroup } from '../ProButton'
import { ProForm, type BuildFormBinding } from '../ProForm'

import { getGlobalOptions } from '~/constant'
import { isPlainObject } from '~/utils'

import type { RenderTrigger } from './interface'
import type { CustomRender } from '../CustomRender'
import type { InternalProButtonGroupOptions } from '../ProButton'
import type { MaybeRefOrGetter, PropType } from 'vue'

export const ModalForm = defineComponent({
  name: 'ModalForm',

  props: {
    modalProps: Object as PropType<MaybeRefOrGetter<ModalProps>>,
    formBinding: Object as PropType<BuildFormBinding<any>>,
    modalAction: Object as PropType<
      MaybeRefOrGetter<false | InternalProButtonGroupOptions>
    >,
    renderTrigger: [Boolean, Function] as PropType<RenderTrigger>,
    renderModal: Object as PropType<CustomRender>,
  },

  setup(props) {
    return () => {
      const modalProps = toValue(props.modalProps)
      const modalAction = toValue(props.modalAction)

      const slots = {
        default: () => <ProForm {...props.formBinding} />,
        footer: () =>
          modalAction === false || !modalAction ? null : (
            <ProButtonGroup action={modalAction} />
          ),
      }

      const $trigger =
        props.renderTrigger === false
          ? null
          : isPlainObject(props.renderTrigger)
          ? buildCustomRender(props.renderTrigger)
          : null

      const modalRenderOptions: CustomRender = {
        ...getGlobalOptions().modal,
        ...props.renderModal,
        context: modalProps,
      }

      if (!modalRenderOptions.is && !modalRenderOptions.render) {
        modalRenderOptions.render = ctx => <Modal {...ctx}>{slots}</Modal>
      }

      const $modal = buildCustomRender(modalRenderOptions, slots)

      return (
        <>
          {$modal}
          {$trigger}
        </>
      )
    }
  },
})
