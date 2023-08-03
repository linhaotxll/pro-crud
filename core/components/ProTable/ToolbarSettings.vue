<template>
  <el-popover trigger="click" popper-style="min-width: 240px;">
    <template #reference>
      <slot name="reference" />
    </template>

    <el-space direction="vertical" fill class="popper-conatainer">
      <div class="popper-top">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          列展示
        </el-checkbox>

        <el-button type="primary" text>重置</el-button>
      </div>

      <div ref="fixedNormal">
        <el-tree
          :data="options"
          :props="defaultProps"
          node-key="prop"
          check-on-click-node
          show-checkbox
          draggable
          :allow-drop="handleAllowDrop"
          @check-change="handleCheckChange"
        >
          <template #default="{ node, data }">
            <span
              class="custom-tree-node"
              @mouseover="handleMouseEnter(data)"
              @mouseout="handleMouseLeave(data)"
            >
              <div class="custom-tree-node-place">
                <el-icon
                  class="sort-icon"
                  :size="14"
                  color="var(--el-text-color-secondary)"
                >
                  <Sort />
                </el-icon>
              </div>

              <span class="el-tree-node__label">{{ node.label }}</span>

              <div v-lazy-show="visibleMap[data.prop]">
                <el-space>
                  <el-tooltip content="固定左侧" placement="top">
                    <el-icon :size="16" color="var(--el-color-primary)">
                      <i-crud-fixed-left />
                    </el-icon>
                  </el-tooltip>

                  <el-tooltip content="固定右侧" placement="top">
                    <el-icon :size="16" color="var(--el-color-primary)">
                      <i-crud-fixed-right />
                    </el-icon>
                  </el-tooltip>
                </el-space>
              </div>
            </span>
          </template>
        </el-tree>
      </div>
    </el-space>
  </el-popover>
</template>

<script setup lang="ts" generic="T extends object">
import { reactive, ref } from 'vue'

import type {
  ColumnSettingsNode,
  InternalProTableColumnProps,
} from './interface'
import type { ComputedRef } from 'vue'

defineOptions({ name: 'ToolbarSettings' })

const p = defineProps<{
  columns: ComputedRef<InternalProTableColumnProps<T>>[]
}>()

const emit = defineEmits<{
  (e: 'change', values: string[]): void
}>()

const fixedNormal = ref<HTMLElement | null>(null)

const checkAll = ref(false)
const isIndeterminate = ref(true)

const { options, visibleMap: v } = p.columns.reduce<{
  options: ColumnSettingsNode[]
  visibleMap: Record<string, boolean>
}>(
  (prev, curr) => {
    const { label, prop } = curr.value.columnProps
    prev.options.push({
      label: label!,
      prop: prop!,
    })

    prev.visibleMap[prop!] = false
    return prev
  },
  { options: [], visibleMap: {} }
)

const visibleMap = reactive(v)

const defaultProps = { label: 'label', children: 'children' }

const allColumns =
  p.columns?.map(column => column.value.columnProps.prop!) ?? []

const checkedColumns = ref<string[]>([...allColumns])

const handleCheckAllChange = (val: boolean) => {
  checkedColumns.value = val ? allColumns : []
  isIndeterminate.value = false

  notifyChange(checkedColumns.value)
}

const handleCheckChange = (
  data: Node,
  checked: boolean,
  indeterminate: boolean
) => {
  console.log(data, checked, indeterminate)
}

function notifyChange(values: string[]) {
  emit('change', values)
}

function handleMouseEnter(node: ColumnSettingsNode) {
  visibleMap[node.prop] = true
}

function handleMouseLeave(node: ColumnSettingsNode) {
  visibleMap[node.prop] = false
}

function handleAllowDrop(_, __, type) {
  return type === 'inner' ? false : true
}
</script>

<style scoped>
.popper-conatainer {
  width: 100%;
}

.popper-conatainer :deep(.el-tree-node__content) {
  position: relative;
}

.custom-tree-node-place {
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 6px;
  width: 100%;
  height: 100%;
}

.popper-top {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.popper-checkbox {
  display: block;
  margin-right: 0 !important;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  justify-content: space-between;
}

.el-tree-node__label {
  flex: 1;
}

.sort-icon {
  cursor: grab;
}
</style>
