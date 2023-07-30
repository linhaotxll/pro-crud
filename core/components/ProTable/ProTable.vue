<template>
  <el-table v-bind="tableProps">
    <el-table-column
      v-for="column in resolvedColumns"
      :key="column.value.prop"
      v-bind="column.value"
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

import type { ProTableProps } from './interface'

defineOptions({ name: 'ProTable' })

const p = defineProps<ProTableProps<T>>()

const { resolvedPagination, resolvedColumns, tableProps, tableSlots } =
  useTable(p)
// console.log('resolvedPagination: ', resolvedPagination.value)
</script>

<style scoped>
.pro-pagination {
  margin-top: 16px;
}
</style>
