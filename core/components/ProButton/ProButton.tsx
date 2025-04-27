import { type ModalProps, type PopconfirmProps } from 'ant-design-vue'
import { computed, defineComponent, ref, toValue } from 'vue'

import { mergeWithTovalue } from '../common'
import { buildCustomRender } from '../CustomRender'
import { showToast } from '../Toast'

import { isArray, isFunction, isPromise } from '~/utils'

import type {
  InternalProButtonOptions,
  ProButtonRenderParams,
} from './interface'
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
    const modalVisible = ref(false)
    const mergedModalProps = computed(() =>
      mergeWithTovalue({}, toValue(props.option.confirmProps), {
        open: modalVisible.value,
        okButtonProps: { loading: buttonLoading.value },
        onOk(e: MouseEvent) {
          return Promise.resolve(
            invokeEventHandler(
              (props.option.confirmProps as ModalProps).onOk,
              e,
              props.option.context
            )
          ).finally(() => {
            modalVisible.value = false
          })
        },
        onCancel() {
          modalVisible.value = false
        },
      })
    )
    const buttonLoading = ref(false)

    function invokeEventHandler(
      handles: MouseEventHandler | MouseEventHandler[] | undefined,
      e: MouseEvent,
      ctx: any
    ) {
      if (!handles) {
        return
      }

      let resultPromise: Promise<any> = Promise.resolve()

      const hideLoading = showToast(props.option.toast, 'loading')

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
          hideLoading?.()
          showToast(props.option.toast, 'success')
          return res
        })
        .catch(e => {
          hideLoading?.()
          showToast(props.option.toast, 'error')
          throw e
        })
        .finally(() => {
          buttonLoading.value = false
        })
    }

    function handleClickButton(e: MouseEvent) {
      // debugger
      const { confirmType, props: buttonProps } = props.option
      if (confirmType === 'popconfirm') {
        return
      }

      if (confirmType === 'modal') {
        // const modelProps = mergeWithTovalue({}, toValue(confirmProps), {
        //   onOk(e: MouseEvent) {
        //     return invokeEventHandler(
        //       (confirmProps as ModalProps).onOk,
        //       e,
        //       props.option.context
        //     )
        //   },
        // })
        modalVisible.value = true
        // Modal.confirm(modelProps)
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
        render = ctx => <a-button {...ctx.props}>{text}</a-button>,
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
            render: ctx => (
              <a-popconfirm {...ctx.props}>{$button}</a-popconfirm>
            ),
            ...confirmRender,
            context: mergedPopconfirmProps,
          }
        )
      }

      let $modal

      if (confirmType === 'modal') {
        console.log('mergedModalProps: ', mergedModalProps.value)
        $modal = buildCustomRender<ProButtonRenderParams<ModalProps>>({
          render: ctx => {
            console.log('props: ', ctx)
            return <a-modal {...ctx}></a-modal>
          },
          ...confirmRender,
          context: mergedModalProps.value,
        })
      }

      if ($modal) {
        return (
          <>
            {$modal}
            {$button}
          </>
        )
      }

      return $popconfirm ?? $button
    }
  },
})
