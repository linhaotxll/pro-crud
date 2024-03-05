import { Col, FormItem } from 'ant-design-vue'
import { defineComponent } from 'vue'

import { ProFormField } from './ProFormField'

import { ValueTypeMap } from '../common'

import type { InternalProFormColumnOptions } from './interface'
import type { PropType, Ref } from 'vue'

export const ProFormItem = defineComponent({
  name: 'ProFormItem',

  props: {
    column: Object as PropType<Ref<InternalProFormColumnOptions<any>>>,
  },

  setup(props) {
    return () => {
      const columnValue = props.column?.value
      if (!columnValue) {
        return null
      }

      console.log('render pro form item')
      if (!columnValue.show) {
        return null
      }

      const field = ValueTypeMap.value[columnValue.type!].form
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
          default: () => <ProFormField field={field} column={props.column} />,
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
