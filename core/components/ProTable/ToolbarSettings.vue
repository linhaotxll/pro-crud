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

      <pro-render :render="renderLeft" />
      <pro-render :render="renderNormal" />
      <pro-render :render="renderRight" />
    </el-space>
  </el-popover>
</template>

<script setup lang="ts" generic="T extends object">
import { reactive, ref } from 'vue'

import { useToolbarSettings } from './useToolbarSettings'

import type { InternalProTableColumnProps } from './interface'
import type { ComputedRef } from 'vue'

defineOptions({ name: 'ToolbarSettings' })

const p = defineProps<{
  columns: ComputedRef<InternalProTableColumnProps<any>>[]
}>()

const emit = defineEmits<{
  (type: 'visible', prop: string, visible: boolean): void
  (type: 'sort', fromIndex: number, toIndex: number): void
  (type: 'fixed', prop: string, fixed?: string | boolean): void
}>()

const {
  fixedNormalOptions: n,
  fixedLeftOptions: l,
  fixedRightOptions: r,
  visibleMap: v,
} = p.columns.reduce<{
  fixedNormalOptions: InternalProTableColumnProps<object>[]
  fixedLeftOptions: InternalProTableColumnProps<object>[]
  fixedRightOptions: InternalProTableColumnProps<object>[]
  visibleMap: Record<string, boolean>
}>(
  (prev, curr) => {
    const { prop, fixed } = curr.value.columnProps
    const column = { ...curr.value, prop }

    if (fixed === true || fixed === 'left') {
      prev.fixedLeftOptions.push(column)
    } else if (fixed === 'right') {
      prev.fixedRightOptions.push(column)
    } else {
      prev.fixedNormalOptions.push(column)
    }

    prev.visibleMap[prop!] = false
    return prev
  },
  {
    fixedNormalOptions: [],
    fixedLeftOptions: [],
    fixedRightOptions: [],
    visibleMap: {},
  }
)

const checkAll = ref(true)
const isIndeterminate = ref(false)

function handleChangeColumnVisible(prop: string, visible: boolean) {
  emit('visible', prop, visible)
}

function handleChangeColumnSort(fromIndex: number, toIndex: number) {
  emit('sort', fromIndex, toIndex)
}

const visibleMap = reactive(v)
const fixedNormalOptions = reactive(n)
const fixedLeftOptions = reactive(l)
const fixedRightOptions = reactive(r)

const allColumns =
  p.columns?.map(column => column.value.columnProps.prop!) ?? []

const checkedColumns = ref<string[]>([...allColumns])

const handleCheckAllChange = (checked: boolean) => {
  const leftKeys = checked
    ? fixedLeftOptions.map(item => item.columnProps.prop)
    : []
  const normalKeys = checked
    ? fixedNormalOptions.map(item => item.columnProps.prop)
    : []
  const rightKeys = checked
    ? fixedRightOptions.map(item => item.columnProps.prop)
    : []

  normalTreeRef.value?.setCheckedKeys(normalKeys)
  leftTreeRef.value?.setCheckedKeys(leftKeys)
  rightTreeRef.value?.setCheckedKeys(rightKeys)

  checkedColumns.value = checked ? allColumns : []
  isIndeterminate.value = false
}

function handleChangeTreeNode(checkedKeys: string[]) {
  const checkedCount = checkedKeys.length
  checkAll.value = checkedCount === allColumns.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allColumns.length
}

function createOnFixed(
  from: InternalProTableColumnProps<object>[],
  to: InternalProTableColumnProps<object>[]
) {
  return function (node: InternalProTableColumnProps<object>) {
    const index = from.findIndex(
      item => item.columnProps.prop! === node.columnProps.prop!
    )
    if (index !== -1) {
      const fromPositionMap = position.get(from) || {}
      fromPositionMap[node.columnProps.prop!] = index
      position.set(from, fromPositionMap)
      from.splice(index, 1)

      const toPositionMap = position.get(to)
      if (!toPositionMap || toPositionMap[node.columnProps.prop!] == null) {
        to.push(node)
      } else {
        to.splice(toPositionMap[node.columnProps.prop!], 0, node)
      }

      const fixed =
        to === fixedNormalOptions
          ? undefined
          : to === fixedLeftOptions
          ? 'left'
          : 'right'

      emit('fixed', node.columnProps.prop!, fixed)
    }
  }
}

const position = new WeakMap()
const { render: renderNormal, treeRef: normalTreeRef } = useToolbarSettings({
  options: fixedNormalOptions,
  visibleMap,
  title: '不固定',
  position,
  onVisible: handleChangeColumnVisible,
  onSort: handleChangeColumnSort,
  onChange: handleChangeTreeNode,
  buttons: [
    {
      content: '固定左侧',
      icon: 'FixedLeft',
      onFixed: createOnFixed(fixedNormalOptions, fixedLeftOptions),
    },
    {
      content: '固定右侧',
      icon: 'FixedRight',
      onFixed: createOnFixed(fixedNormalOptions, fixedRightOptions),
    },
  ],
})

const { render: renderLeft, treeRef: leftTreeRef } = useToolbarSettings({
  options: fixedLeftOptions,
  visibleMap,
  title: '固定左侧',
  position,

  onVisible: handleChangeColumnVisible,
  onSort: handleChangeColumnSort,
  onChange: handleChangeTreeNode,
  buttons: [
    {
      content: '不固定',
      icon: 'FixedNormal',
      onFixed: createOnFixed(fixedLeftOptions, fixedNormalOptions),
    },
    {
      content: '固定右侧',
      icon: 'FixedRight',
      onFixed: createOnFixed(fixedLeftOptions, fixedRightOptions),
    },
  ],
})

const { render: renderRight, treeRef: rightTreeRef } = useToolbarSettings({
  options: fixedRightOptions,
  visibleMap,
  title: '固定右侧',
  position,
  onVisible: handleChangeColumnVisible,
  onSort: handleChangeColumnSort,
  onChange: handleChangeTreeNode,
  buttons: [
    {
      content: '不固定',
      icon: 'FixedNormal',
      onFixed: createOnFixed(fixedRightOptions, fixedNormalOptions),
    },
    {
      content: '固定左侧',
      icon: 'FixedLeft',
      onFixed: createOnFixed(fixedRightOptions, fixedLeftOptions),
    },
  ],
})
</script>

<style scoped>
.popper-conatainer {
  width: 100%;
}

.popper-conatainer :deep(.el-tree-node__content) {
  position: relative;
}

:deep(.custom-tree-node-place) {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  padding-top: 6px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.popper-top {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

:deep(.custom-tree-node) {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 46px;
  width: 100%;
  height: 100%;
  flex: 1;
  box-sizing: border-box;
}

:deep(.el-tree-node__label) {
  flex: 1;
}
</style>
