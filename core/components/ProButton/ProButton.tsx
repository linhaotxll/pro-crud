import { Button, Modal, Popconfirm } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'

import { mergeWithTovalue } from '../common'

import { isArray, isFunction } from '~/utils'

import type { InternalProButtonOptions } from './interface'
import type { ModalProps, PopconfirmProps } from 'ant-design-vue'
import type { MouseEventHandler } from 'ant-design-vue/es/_util/EventInterface'
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
    const buttonLoading = ref(false)

    function invokeEventHandler(
      handles: MouseEventHandler | MouseEventHandler[] | undefined,
      e: MouseEvent,
      ctx: any
    ) {
      if (!handles) {
        return
      }

      if (isFunction(handles)) {
        buttonLoading.value = true
        // @ts-ignore
        return Promise.resolve(handles(e, ctx)).finally(() => {
          buttonLoading.value = false
        })
      } else if (isArray(handles)) {
        buttonLoading.value = true
        const tasks: Promise<any>[] = []
        for (const handle of handles) {
          // @ts-ignore
          tasks.push(Promise.resolve(handle(e, ctx)))
        }
        return Promise.allSettled(tasks).finally(() => {
          buttonLoading.value = false
        })
      }
    }

    function handleClickButton(e: MouseEvent) {
      const { confirmProps, confirmType, props: buttonProps } = props.option
      if (confirmType === 'popconfirm') {
        return
      }

      if (confirmType === 'modal') {
        const modelProps = mergeWithTovalue({}, confirmProps, {
          onOk(e: MouseEvent) {
            return invokeEventHandler(
              (confirmProps as ModalProps).onOk,
              e,
              props.option.ctx
            )
          },
        })
        Modal.confirm(modelProps)
        return
      }

      invokeEventHandler(buttonProps?.onClick, e, props.option.ctx)
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
        ctx,
      } = props.option

      if (typeof render === 'function') {
        return render({ loading: buttonLoading.value }, ctx)
      }

      const { onClick: _, ...restProps } = buttonProps ?? {}

      const $button = (
        <Button
          {...restProps}
          loading={buttonLoading.value}
          onClick={handleClickButton}
        >
          {text}
        </Button>
      )

      let $popconfirm
      if (confirmType === 'popconfirm') {
        const props = mergeWithTovalue({}, confirmProps, {
          onConfirm(e: MouseEvent) {
            return invokeEventHandler(
              (confirmProps as PopconfirmProps).onConfirm,
              e,
              ctx
            )
          },
        })

        $popconfirm = <Popconfirm {...props}>{$button}</Popconfirm>
      }

      return $popconfirm ?? $button
    }
  },
})
