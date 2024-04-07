import { toValue } from '@vueuse/core'
import { Flex, Table, type TableProps } from 'ant-design-vue'
import { defineComponent } from 'vue'

import { ProButtonGroup } from '../ProButton'
import { ProForm } from '../ProForm'

import type { BuildTableBinding } from './interface'
import type { MaybeRef } from '../common'
import type { InternalProButtonGroupOptions } from '../ProButton'
import type { MaybeRefOrGetter } from '@vueuse/core'
import type { PropType, Ref } from 'vue'

export const ProTable = defineComponent({
  name: 'ProTable',

  props: {
    tableProps: Object as PropType<MaybeRef<TableProps>>,
    proFormBinding: Object as PropType<
      MaybeRefOrGetter<BuildTableBinding<any, any>['proFormBinding']>
    >,
    toolbar: Object as PropType<Ref<InternalProButtonGroupOptions>>,
  },

  setup(props) {
    return () => {
      const $table = <Table {...toValue(props.tableProps)} />

      const resolvedToolbar = toValue(props.toolbar)

      const $toolbar = resolvedToolbar?.show ? (
        <ProButtonGroup action={resolvedToolbar} />
      ) : null

      const $search = toValue(props.proFormBinding) ? (
        <ProForm {...toValue(props.proFormBinding)} />
      ) : null

      const $children = [$search, $toolbar, $table].filter(Boolean)

      return $children.length > 1 ? <Flex>{$children}</Flex> : $children[0]
    }
  },
})
