<template>
  <el-table-column v-bind="column.columnProps">
    <template v-if="defaultSlot[0]" #default="ctx">
      <pro-render v-if="defaultSlot[1]" :render="defaultSlot[1]" :ctx="ctx" />
      <pro-render
        v-else-if="defaultSlot[2]"
        :render="defaultSlot[2]"
        :ctx="getTableTypeRenderParams(ctx)"
      />

      <component
        :is="defaultSlot[3]"
        v-else-if="defaultSlot[3]"
        v-bind="{ ctx: getTableTypeRenderParams(ctx) }"
      />
    </template>

    <template v-if="column.columnSlots?.header" #header="ctx">
      <pro-render :render="column.columnSlots?.header" :ctx="ctx" />
    </template>
  </el-table-column>
</template>

<script lang="ts" setup generic="T">
import { computed } from 'vue'

import { ValueTypeMap } from '../common'

import type {
  InternalProTableColumnProps,
  TableDefaultSlotParams,
} from './interface'
import type { ValueTypeTable, ValueTypeTableRenderParams } from '../common'
defineOptions({ name: 'ProTableColumn' })

const p = defineProps<{
  column: InternalProTableColumnProps<T>
}>()

const getTableTypeRenderParams = (
  ctx: TableDefaultSlotParams<T>
): ValueTypeTableRenderParams<T> => ({
  row: ctx.row,
  $index: ctx.$index,
  column: ctx.column,
  text: (ctx.row as any)[ctx.column.property],
  internalColumn: p.column,
})

const defaultSlot = computed(() => {
  let isDefaultSlot = false
  let renderDefaultSlot: ((...args: any[]) => JSX.Element) | undefined
  let renderType: ValueTypeTable<T>['render']
  let is: any

  if ((renderDefaultSlot = p.column.columnSlots?.default)) {
    isDefaultSlot = true
  } else if ((is = ValueTypeMap.value[p.column.type].table?.is)) {
    isDefaultSlot = true
  } else if ((renderType = ValueTypeMap.value[p.column.type].table?.render)) {
    isDefaultSlot = true
  }

  return [isDefaultSlot, renderDefaultSlot, renderType, is]
})
</script>
