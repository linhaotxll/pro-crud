<template>
  <el-table v-loading="loading" v-bind="tableProps">
    <pro-table-column
      v-for="column in resolvedColumns"
      :key="column.value.columnProps.prop"
      :column="column.value"
    />

    <template v-if="tableSlots?.empty" #empty>
      <pro-render :render="tableSlots.empty" />
    </template>

    <template v-if="tableSlots?.append" #append>
      <pro-render :render="tableSlots.append" />
    </template>
  </el-table>

  <el-pagination
    v-if="resolvedPagination !== false"
    class="pro-pagination"
    v-bind="resolvedPagination"
  />
</template>

<script lang="ts" setup generic="T">
import { useTable } from './useTable'

import type { ProTableProps, ProTableInstance } from './interface'

defineOptions({ name: 'ProTable' })

const p = defineProps<ProTableProps<T>>()

const {
  resolvedPagination,
  resolvedColumns,
  tableProps,
  tableSlots,
  loading,
  ...rest
} = useTable(p)

defineExpose<ProTableInstance<T>>(rest)
</script>

<style scoped>
.pro-pagination {
  margin-top: 16px;
}
</style>
