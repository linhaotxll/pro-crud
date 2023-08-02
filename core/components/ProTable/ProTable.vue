<template>
  <div class="pro-table-container">
    <div class="pro-table-top">
      <div></div>

      <div
        v-if="toolbar.value.show"
        class="pro-table-toolbar"
        :class="toolbar.value.class"
        :style="toolbar.value.style"
      >
        <el-space>
          <div v-for="(item, i) in toolbar.value.list" :key="i">
            <pro-render v-if="item.render" />
            <el-icon v-else v-bind="item.props">
              <component :is="item.icon" />
            </el-icon>
          </div>
        </el-space>
      </div>
    </div>

    <el-table
      v-loading="loading.value.visible"
      :element-loading-text="loading.value.text"
      :element-loading-background="loading.value.background"
      :element-loading-svg="loading.value.svg"
      :element-loading-spinner="loading.value.spinner"
      class="pro-table"
      v-bind="tableProps.value"
    >
      <pro-table-column
        v-for="column in columns"
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
      v-if="pagination.value !== false"
      class="pro-pagination"
      v-bind="pagination.value"
    />
  </div>
</template>

<script lang="ts" setup generic="T extends object">
import type { ProTableProps, ProTableInstance } from './interface'

defineOptions({ name: 'ProTable' })

const p = defineProps<ProTableProps<T>>()

defineExpose<ProTableInstance<T>>({
  ...p.scope,
})
</script>

<style scoped>
/* .pro-table-container {
  display: flex;
  overflow: auto;
  height: 100%;
  flex-direction: column;
}

.pro-table {
  flex: 1;
} */

.pro-table-top {
  display: flex;
  justify-content: space-between;
}

.pro-pagination {
  margin-top: 16px;
}
</style>
