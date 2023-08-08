<template>
  <div class="pro-table-container">
    <div class="pro-table-top">
      <div class="pro-table-actionbar"></div>

      <div
        v-if="toolbar.value.show"
        class="pro-table-toolbar"
        :class="toolbar.value.class"
        :style="toolbar.value.style"
      >
        <el-space v-bind="toolbar.value.space">
          <div v-for="(item, i) in toolbar.value.list" :key="i">
            <el-tooltip v-if="item.tooltip!.show" v-bind="item.tooltip">
              <pro-render
                v-if="item.render"
                :render="item.render"
                :ctx="item.props"
              />
              <el-button v-else v-bind="item.props"></el-button>
            </el-tooltip>

            <template v-else>
              <pro-render
                v-if="item.render"
                :render="item.render"
                :ctx="item.props"
              />
              <el-button v-else v-bind="item.props"></el-button>
            </template>
          </div>
        </el-space>
      </div>
    </div>

    <el-table
      ref="tableRef"
      v-loading="loading.value.visible"
      :element-loading-text="loading.value.text"
      :element-loading-background="loading.value.background"
      :element-loading-svg="loading.value.svg"
      :element-loading-spinner="loading.value.spinner"
      class="pro-table"
      v-bind="tableProps.value"
    >
      <template v-for="column in columns" :key="column.value.columnProps.prop">
        <pro-table-column v-if="column.value.show" :column="column.value" />
      </template>

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
import { toRaw } from 'vue'

import type { ProTableProps, ProTableInstance } from './interface'

defineOptions({ name: 'ProTable' })

const p = defineProps<ProTableProps<T>>()

const tableRef = toRaw(p).tableRef

defineExpose<ProTableInstance<T>>({
  ...p.scope,
})
</script>

<style scoped>
.pro-table-top {
  display: flex;
  justify-content: space-between;
}

.pro-table-toolbar,
.pro-table-actionbar {
  margin-bottom: 16px;
}

.pro-pagination {
  margin-top: 16px;
}
</style>
