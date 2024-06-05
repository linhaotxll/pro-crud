import { toValue } from '@vueuse/core'
import { Flex, Table, type TableProps } from 'ant-design-vue'
import { defineComponent, isRef } from 'vue'

import { ProButtonGroup } from '../ProButton'
import { ProForm } from '../ProForm'

import { isFunction } from '~/utils'

import type { TableSlotFn, TableSlotValueKey } from './constant'
import type { BuildTableBinding } from './interface'
import type { InternalProButtonGroupOptions } from '../ProButton'
import type { FlexProps } from 'ant-design-vue'
import type { ComputedRef, PropType, Ref } from 'vue'

export const ProTable = defineComponent({
  name: 'ProTable',

  props: {
    tableProps: Object as PropType<ComputedRef<TableProps>>,
    tableSlots: Object as PropType<
      ComputedRef<Record<TableSlotValueKey, TableSlotFn> | null>
    >,
    search: {
      type: Object as PropType<BuildTableBinding['search']>,
      required: true,
    },
    toolbar: Object as PropType<Ref<InternalProButtonGroupOptions>>,
    wrapperProps: Object as PropType<ComputedRef<FlexProps>>,
    renderWrapper: Object as PropType<BuildTableBinding['renderWrapper']>,
  },

  setup(props) {
    return () => {
      console.log('table props: ', toValue(props.tableProps))
      console.log('table slots: ', toValue(props.tableSlots))

      const $table = (
        <Table {...toValue(props.tableProps)}>
          {toValue(props.tableSlots)}
        </Table>
      )

      const resolvedToolbar = toValue(props.toolbar)

      const $toolbar = resolvedToolbar?.show ? (
        <ProButtonGroup action={resolvedToolbar} />
      ) : null

      const searchValue = toValue(props.search)

      const $search =
        searchValue !== false ? <ProForm {...searchValue} /> : null

      const $children = [$search, $toolbar, $table].filter(Boolean)

      if ($children.length > 1) {
        const Wrap = isRef(props.renderWrapper) ? (
          props.renderWrapper.value($children)
        ) : isFunction(props.renderWrapper) ? (
          props.renderWrapper($children)
        ) : (
          <Flex {...toValue(props.wrapperProps)}>{$children}</Flex>
        )

        return Wrap
      }

      return $children[0]
    }
  },
})
