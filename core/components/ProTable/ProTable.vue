<template>
  <div class="pro-table-container">
    <el-table
      v-loading="loadingConfig.visible"
      :element-loading-text="loadingConfig.text"
      :element-loading-background="loadingConfig.background"
      :element-loading-svg="loadingConfig.svg"
      :element-loading-spinner="loadingConfig.spinner"
      class="pro-table"
      v-bind="tableProps"
    >
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
  </div>
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
  loadingConfig,
  ...rest
} = useTable(p)

defineExpose<ProTableInstance<T>>(rest)
</script>

<style scoped>
.pro-table-container {
  display: flex;
  overflow: auto;
  height: 100%;
  flex-direction: column;
}

.pro-table {
  flex: 1;
}

.pro-pagination {
  margin-top: 16px;
}
</style>
