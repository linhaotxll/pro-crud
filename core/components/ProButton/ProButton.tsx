import { Button, Modal, Popconfirm } from 'ant-design-vue'
import { defineComponent } from 'vue'

import { invokeEventHandler } from '../common'

import type { InternalProButtonOptions } from './interface'
import type { ModalProps, PopconfirmProps } from 'ant-design-vue'
import type { PropType } from 'vue'

export const ProButton = defineComponent({
  name: 'ProButton',

  props: {
    option: {
      type: Object as PropType<InternalProButtonOptions>,
      required: true,
    },
  },

  setup(props) {
    function handleClickButton(e: MouseEvent) {
      const { confirmProps, confirmType, props: buttonProps } = props.option
      if (confirmType === 'popconfirm') {
        return
      }

      if (confirmType === 'modal') {
        Modal.confirm(confirmProps as ModalProps)
        return
      }

      invokeEventHandler(buttonProps?.onClick, e)
    }

    return () => {
      if (!props.option || !props.option.show) {
        return null
      }

      const {
        text,
        props: buttonProps,
        confirmType,
        confirmProps,
        render,
      } = props.option

      if (typeof render === 'function') {
        return render()
      }

      const { onClick: _, ...restProps } = buttonProps ?? {}

      const $button = (
        <Button {...restProps} onClick={handleClickButton}>
          {text}
        </Button>
      )

      const $popconfirm =
        confirmType === 'popconfirm' ? (
          <Popconfirm {...(confirmProps as PopconfirmProps)}>
            {$button}
          </Popconfirm>
        ) : null

      return $popconfirm ?? $button
    }
  },
})
