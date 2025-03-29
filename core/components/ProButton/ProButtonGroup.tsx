import { Space } from 'ant-design-vue'
import { defineComponent, toValue } from 'vue'

import { ProButton } from './ProButton'

import type { InternalProButtonGroupOptions } from './interface'
import type { MaybeRefOrGetter, PropType } from 'vue'

export const ProButtonGroup = defineComponent({
  name: 'ProButtonGroup',

  props: {
    action: Object as PropType<MaybeRefOrGetter<InternalProButtonGroupOptions>>,
  },

  setup(props) {
    return () => {
      const actionValue = toValue(props.action)
      if (!actionValue || !actionValue.show) {
        return null
      }

      const { actions, space } = actionValue

      if (!actions || !actions.length) {
        return null
      }

      let $actions: any[] | null = null

      for (const action of actions) {
        if (action.show) {
          $actions ||= []
          $actions.push(
            <ProButton key={action.text} option={action}></ProButton>
          )
        }
      }

      return $actions ? <Space {...space}>{$actions}</Space> : null
    }
  },
})
