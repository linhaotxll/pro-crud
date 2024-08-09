import { Flex, Steps } from 'ant-design-vue'
import { defineComponent, toValue } from 'vue'

import { buildCustomRender } from '../CustomRender'
import { ProForm } from '../ProForm'

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

      const $steps = <Steps {...stepsProps} />
      const $form = <ProForm {...props.proFormBinding} />

      const Wrap = buildCustomRender<CustomRenderStepsFormWrapContext>({
        fallback: ctx => (
          <Flex vertical gap={24}>
            {ctx.$steps}
            {ctx.$form}
          </Flex>
        ),
        ...props.wrap,
        context: { $steps, $form },
      })

      return Wrap
    }
  },
})
