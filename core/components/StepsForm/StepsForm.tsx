import { defineComponent, toValue, unref } from 'vue'

import { ProForm } from '../ProForm'

import { isFunction } from '~/utils'

import type { CustomRenderStepsFormWrapContext } from './interface'
import type { CustomRender } from '../CustomRender'
import type { BuildFormBinding } from '../ProForm'
import type { StepsProps } from 'ant-design-vue'
import type { MaybeRefOrGetter, PropType } from 'vue'

export const StepsForm = defineComponent({
  name: 'StepsForm',

  props: {
    stepsProps: Object as PropType<MaybeRefOrGetter<StepsProps>>,
    proFormBinding: Object as PropType<BuildFormBinding>,
    wrap: Object as PropType<CustomRender | undefined>,
  },

  setup(props) {
    return () => {
      const stepsProps = toValue(props.stepsProps)
      const $steps = <a-steps {...stepsProps} />

      const $form = (
        <ProForm
          {...props.proFormBinding}
          wrap={{
            render(ctx) {
              const context: CustomRenderStepsFormWrapContext = {
                ...ctx,
                $steps,
              }

              const render = unref(props.wrap?.render)
              if (isFunction(render)) {
                return render(context)
              }

              return (
                <a-flex gap={24} vertical>
                  {$steps}
                  <div>{ctx.$items}</div>

                  {ctx.$action}
                </a-flex>
              )
            },
          }}
        />
      )

      return $form
    }
  },
})
