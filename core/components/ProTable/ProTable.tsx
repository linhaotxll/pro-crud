import { toValue } from '@vueuse/core'
import { Flex, Table, type TableProps } from 'ant-design-vue'
import { defineComponent } from 'vue'

import { ProButtonGroup } from '../ProButton'
import { ProForm } from '../ProForm'

import type { TableSlotFn, TableSlotValueKey } from './constant'
import type { BuildTableBinding } from './interface'
import type { MaybeRef } from '../common'
import type { InternalProButtonGroupOptions } from '../ProButton'
import type { MaybeRefOrGetter } from '@vueuse/core'
import type { ComputedRef, PropType, Ref } from 'vue'

export const ProTable = defineComponent({
  name: 'ProTable',

  props: {
    tableProps: Object as PropType<MaybeRef<TableProps>>,
    tableSlots: Object as PropType<
      ComputedRef<Record<TableSlotValueKey, TableSlotFn> | null>
    >,
    search: {
      type: Object as PropType<BuildTableBinding['search']>,
      required: true,
    },
    toolbar: Object as PropType<Ref<InternalProButtonGroupOptions>>,
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

      return $children.length > 1 ? (
        <Flex vertical>{$children}</Flex>
      ) : (
        $children[0]
      )
    }
  },
})
