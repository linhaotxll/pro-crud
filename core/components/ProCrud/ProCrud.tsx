import { defineComponent, toValue } from 'vue'

import { ModalForm } from '../ModalForm'
import { ProTable } from '../ProTable'

import type { ModalFormBinding } from '../ModalForm'
import type { BuildTableBinding } from '../ProTable'
import type { PropType } from 'vue'

export const ProCrud = defineComponent({
  name: 'ProCrud',

  props: {
    modalFormBinding: Object as PropType<ModalFormBinding>,
    tableBinding: Object as PropType<BuildTableBinding>,
  },

  setup(props) {
    return () => {
      const $table = props.tableBinding ? (
        <ProTable {...toValue(props.tableBinding)} />
      ) : null
      return (
        <>
          {$table}
          <ModalForm {...toValue(props.modalFormBinding)} />
        </>
      )
    }
  },
})
