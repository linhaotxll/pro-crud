<template>
  <el-table-column v-bind="column.columnProps">
    <template v-if="column.columnSlots?.default" #default="ctx">
      <pro-render :render="column.columnSlots?.default" :ctx="ctx" />
    </template>

    <template v-if="column.columnSlots?.header" #header="ctx">
      <pro-render :render="column.columnSlots?.header" :ctx="ctx" />
    </template>
  </el-table-column>
</template>

<script lang="ts" setup generic="T">
import type { InternalProTableColumnProps } from './interface'
defineOptions({ name: 'ProTableColumn' })

defineProps<{
  column: InternalProTableColumnProps<T>
}>()
</script>
