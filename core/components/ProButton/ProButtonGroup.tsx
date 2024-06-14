import { Space } from 'ant-design-vue'
import { defineComponent } from 'vue'

import { ProButton } from './ProButton'

import { toValueWithCtx } from '../common'

import type { InternalProButtonGroupOptions } from './interface'
import type { MaybeRefOrGetter } from '../common'
import type { PropType } from 'vue'

export const ProButtonGroup = defineComponent({
  name: 'ProButtonGroup',

  props: {
    action: Object as PropType<MaybeRefOrGetter<InternalProButtonGroupOptions>>,
  },

  setup(props) {
    return () => {
      const actionValue = toValueWithCtx(props.action)
      if (!actionValue || !actionValue.show) {
        return null
      }

      const { actions, space } = actionValue

      const $actions = actions
        ? actions.map(action => (
            <ProButton key={action.text} option={action}></ProButton>
          ))
        : null

      return $actions ? <Space {...space}>{$actions}</Space> : null
    }
  },
})
