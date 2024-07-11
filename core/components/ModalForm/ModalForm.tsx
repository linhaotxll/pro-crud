import { Modal, type ModalProps } from 'ant-design-vue'
import { defineComponent, toValue } from 'vue'

import { ProButtonGroup } from '../ProButton'
import { ProForm, type BuildFormBinding } from '../ProForm'

import type { InternalProButtonGroupOptions } from '../ProButton'
import type { MaybeRefOrGetter, PropType, VNodeChild } from 'vue'

export const ModalForm = defineComponent({
  name: 'ModalForm',

  props: {
    modalProps: Object as PropType<MaybeRefOrGetter<ModalProps>>,
    formBinding: Object as PropType<BuildFormBinding<any>>,
    modalAction: Object as PropType<
      MaybeRefOrGetter<false | InternalProButtonGroupOptions>
    >,
    renderTrigger: Function as PropType<() => VNodeChild>,
  },

  setup(props) {
    return () => {
      const modalProps = toValue(props.modalProps)
      const modalAction = toValue(props.modalAction)

      console.log('modalAction: ', modalAction)

      const slots = {
        default: () => <ProForm {...props.formBinding} />,
        footer: () =>
          modalAction === false || !modalAction ? null : (
            <ProButtonGroup action={modalAction} />
          ),
      }

      return (
        <>
          <Modal {...modalProps}>{slots}</Modal>
          {props.renderTrigger?.()}
        </>
      )
    }
  },
})
