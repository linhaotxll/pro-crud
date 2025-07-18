import { type FormItemProps } from 'ant-design-vue'
import { defineComponent, toValue } from 'vue'

import { ProFormListPlaceholder } from './constant'
import { ProFormField } from './ProFormField'

import { findAndReplace } from '../common'

import { getGlobalOptions } from '~/constant'

import type { InternalProFormColumnOptions, ProFormScope } from './interface'
import type { MaybeRefOrGetter, PropType } from 'vue'

export const ProFormItem = defineComponent({
  name: 'ProFormItem',

  props: {
    column: {
      type: Object as PropType<
        MaybeRefOrGetter<InternalProFormColumnOptions<any>>
      >,
      required: true,
    },
    scope: Object as PropType<ProFormScope<any>>,
    index: Number as PropType<number>,
  },

  setup(props) {
    return () => {
      const columnValue = toValue(props.column)

      if (!columnValue.show) {
        return null
      }

      const resolvedNamePath = Array.isArray(columnValue.name)
        ? findAndReplace(columnValue.name, ProFormListPlaceholder, props.index)
        : columnValue.name

      const field = getGlobalOptions().types[columnValue.type!]?.form
      if (!field) {
        console.warn(`"${columnValue.type}" Not Found`)
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
              name={resolvedNamePath}
            />
          ),
        }
      )

      const formItemProps: FormItemProps = {
        ...columnValue.itemProps,
        name: resolvedNamePath,
      }

      if (toValue(props.column).type === 'list') {
        delete formItemProps.name
      }

      return (
        <a-col {...columnValue.col}>
          <a-form-item {...formItemProps}>{slots}</a-form-item>
        </a-col>
      )
    }
  },
})
