import { defineComponent, h, resolveComponent, toValue } from 'vue'

import { mergeWithTovalue, type ValueTypeForm } from '../common'

import type { InternalProFormColumnOptions } from './interface'
import type { PropType, Ref } from 'vue'

export const ProFormField = defineComponent({
  name: 'ProFormField',

  props: {
    column: Object as PropType<Ref<InternalProFormColumnOptions<any>>>,
    field: {
      type: Object as PropType<ValueTypeForm<any>>,
      required: true,
    },
  },

  setup(props) {
    return () => {
      const columnValue = props.column?.value
      if (!columnValue) {
        return null
      }

      console.log('render pro field: ')
      const { is, props: fieldProps, render } = props.field!
      const mergeProps = mergeWithTovalue(
        {},
        toValue(fieldProps),
        toValue(props.column)?.fieldProps
      )

      const slots = columnValue.fieldSlots
        ? Object.entries(columnValue.fieldSlots).reduce<Record<string, any>>(
            (prev, [slotName, slotFn]) => {
              prev[slotName] = (...args: any) => slotFn(...args, columnValue)
              return prev
            },
            {}
          )
        : undefined

      return h(resolveComponent(is), mergeProps, slots)
    }
  },
})
