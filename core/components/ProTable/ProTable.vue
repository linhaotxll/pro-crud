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
        <a-space v-bind="toolbar.value.space">
          <template v-for="(item, i) in toolbar.value.actions">
            <div v-if="item.show" :key="i">
              <a-tooltip v-if="item.tooltip!.show" v-bind="item.tooltip">
                <pro-render
                  v-if="item.render"
                  :render="item.render"
                  :ctx="item.props"
                />
                <a-button v-else v-bind="item.props"></a-button>
              </a-tooltip>

              <template v-else>
                <pro-render
                  v-if="item.render"
                  :render="item.render"
                  :ctx="item.props"
                />
                <a-button v-else v-bind="item.props"></a-button>
              </template>
            </div>
          </template>
        </a-space>
      </div>
    </div>

    <a-form :model="editableTableData?.values">
      <a-table
        ref="tableRef"
        class="pro-table"
        v-bind="tableProps.value"
        :loading="loading.value"
        :columns="columns.value"
      >
        <template
          v-for="(render, name) in tableSlots"
          :key="name"
          #[name]="ctx"
        >
          <pro-render :render="render" :ctx="ctx" />
        </template>
      </a-table>
    </a-form>
  </div>
</template>

<script lang="ts" setup generic="T extends object">
// import { toRaw } from 'vue'

// import ProTableColumn from './ProTableColumn.vue'

import type { ProTableProps } from './interface'

defineOptions({ name: 'ProTable' })

defineProps<ProTableProps<T>>()

// const tableRef = toRaw(p).tableRef

// defineExpose<ProTableInstance<T>>({
//   ...p.scope,
// })
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
