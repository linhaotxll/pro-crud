import { Col, FormItem } from 'ant-design-vue'
import { defineComponent, toValue } from 'vue'

import { ProFormField } from './ProFormField'

import { ensureValueType } from '../common'

import type { InternalProFormColumnOptions, ProFormScope } from './interface'
import type { PropType, Ref } from 'vue'

export const ProFormItem = defineComponent({
  name: 'ProFormItem',

  props: {
    column: {
      type: Object as PropType<Ref<InternalProFormColumnOptions<any>>>,
      required: true,
    },
    scope: Object as PropType<ProFormScope<any>>,
  },

  setup(props) {
    return () => {
      const columnValue = toValue(props.column)

      console.log('render pro form item')
      if (!columnValue.show) {
        return null
      }

      const field = ensureValueType()[columnValue.type!]?.form
      if (!field) {
        return null
      }

      const slots = Object.entries(columnValue.itemSlots ?? {}).reduce<
        Record<string, any>
      >(
        (prev, [slotName, slotFn]) => {
          prev[slotName] = (...args: any[]) => slotFn(columnValue, ...args)
          return prev
        },
        {
          default: () => (
            <ProFormField
              field={field}
              scope={props.scope}
              column={props.column}
            />
          ),
        }
      )

      return (
        <Col {...columnValue.col}>
          <FormItem {...columnValue.itemProps}>{slots}</FormItem>
        </Col>
      )
    }
  },
})
