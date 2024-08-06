import { Flex, Steps } from 'ant-design-vue'
import { defineComponent, toValue } from 'vue'

import { ProForm } from '../ProForm'

import type { BuildFormBinding } from '../ProForm'
import type { StepsProps } from 'ant-design-vue'
import type { MaybeRefOrGetter, PropType } from 'vue'

export const StepsForm = defineComponent({
  name: 'StepsForm',

  props: {
    stepsProps: Object as PropType<MaybeRefOrGetter<StepsProps>>,
    proFormBinding: Object as PropType<BuildFormBinding>,
  },

  setup(props) {
    return () => {
      const stepsProps = toValue(props.stepsProps)

      console.log('stepsProps: ', stepsProps)

      return (
        <Flex vertical>
          <Steps {...stepsProps} />
          <ProForm {...props.proFormBinding} />
        </Flex>
      )
    }
  },
})
