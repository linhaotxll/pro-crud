import { ref } from 'vue'

import type { ProTableEditable, ProTableScope } from './interface'
import type { NamePath } from 'ant-design-vue/es/form/interface'

export function useEditable(editable: ProTableEditable | undefined) {
  if (editable === false) {
    return
  }

  const editRowKeys = ref<string[]>([])
  const editCellName = ref<NamePath>()

  const startEditable: ProTableScope['startEditable'] = (
    rowKey,
    columnName
  ) => {
    editRowKeys.value = Array.isArray(rowKey) ? rowKey : [rowKey]
    columnName && (editCellName.value = columnName)
  }

  return { startEditable, editRowKeys, editCellName }
}
