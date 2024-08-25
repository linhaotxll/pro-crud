import { Button, Modal, Popconfirm } from 'ant-design-vue'
import { defineComponent, ref, toValue } from 'vue'

import { useToast } from './shotToast'

import { mergeWithTovalue } from '../common'
import { buildCustomRender } from '../CustomRender'

import { isArray, isFunction, isPromise } from '~/utils'

import type {
  InternalProButtonOptions,
  ProButtonRenderParams,
} from './interface'
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

      const { open } = useToast(props.option.toast)

      open('loading')

      let resultPromise: Promise<any> = Promise.resolve()

      if (isFunction(handles)) {
        buttonLoading.value = true
        // @ts-ignore
        const handlesResult = handles(e, ctx)

        resultPromise = isPromise(handlesResult)
          ? handlesResult
          : Promise.resolve(handlesResult)
      } else if (isArray(handles)) {
        buttonLoading.value = true
        const tasks: Promise<any>[] = []
        for (const handle of handles) {
          // @ts-ignore
          tasks.push(Promise.resolve(handle(e, ctx)))
        }
        resultPromise = Promise.all(tasks)
      }

      return resultPromise
        .then(res => {
          open('success')
          return res
        })
        .catch(e => {
          open('error')
          throw e
        })
        .finally(() => {
          buttonLoading.value = false
        })
    }

    function handleClickButton(e: MouseEvent) {
      const { confirmProps, confirmType, props: buttonProps } = props.option
      if (confirmType === 'popconfirm') {
        return
      }

      if (confirmType === 'modal') {
        const modelProps = mergeWithTovalue({}, toValue(confirmProps), {
          onOk(e: MouseEvent) {
            return invokeEventHandler(
              (confirmProps as ModalProps).onOk,
              e,
              props.option.context
            )
          },
        })
        Modal.confirm(modelProps)
        return
      }

      invokeEventHandler(buttonProps?.onClick, e, props.option.context)
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
        confirmRender,
        render = ctx => <Button {...ctx.props}>{text}</Button>,
        context,
        is,
      } = props.option

      const resolvedButtonProps = toValue(buttonProps)

      const mergedContext: ProButtonRenderParams = mergeWithTovalue(
        {},
        toValue(context),
        resolvedButtonProps ? { props: resolvedButtonProps } : null,
        { props: { onClick: handleClickButton, loading: buttonLoading.value } }
      )

      const $button = buildCustomRender<ProButtonRenderParams>({
        context: mergedContext,
        is: is,
        render,
      })

      let $popconfirm
      if (confirmType === 'popconfirm') {
        const resolvedConfirmProp = toValue(confirmProps)
        const mergedPopconfirmProps = mergeWithTovalue(
          {},
          resolvedConfirmProp ? { props: resolvedConfirmProp } : null,
          {
            props: {
              onConfirm(e: MouseEvent) {
                return invokeEventHandler(
                  (confirmProps as PopconfirmProps).onConfirm,
                  e,
                  context
                )
              },
            },
          }
        )

        $popconfirm = buildCustomRender<ProButtonRenderParams<PopconfirmProps>>(
          {
            render: ctx => <Popconfirm {...ctx.props}>{$button}</Popconfirm>,
            ...confirmRender,
            context: mergedPopconfirmProps,
          }
        )
      }

      return $popconfirm ?? $button
    }
  },
})
