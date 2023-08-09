<template>
  <el-col v-bind="column.col">
    <el-form-item ref="formItemRef" v-bind="column.itemProps">
      <template #label="{ label }">
        <span>{{ label }}</span>

        <el-tooltip v-if="column.tooltip" v-bind="column.tooltip">
          <pro-render
            v-if="column.tooltip.slots?.icon"
            :render="column.tooltip.slots.icon"
            :ctx="tooltipIconStyle"
          />
          <el-icon v-else :style="tooltipIconStyle" :size="18">
            <Warning />
          </el-icon>

          <template v-if="column.tooltip.slots?.content" #content>
            <pro-render :render="column.tooltip.slots.content" />
          </template>
        </el-tooltip>
      </template>

      <template v-if="column.itemSlots?.error" #error="{ error }">
        <pro-render :render="column.itemSlots.error" :ctx="error" />
      </template>

      <dynamic-v-model :column="column" :values="values" />
    </el-form-item>
  </el-col>
</template>

<script lang="ts" setup generic="T extends object">
import { Warning } from '@element-plus/icons-vue'
import { onUnmounted, toRaw } from 'vue'
import { ref } from 'vue'

import DynamicVModel from './DynamicVModel.vue'

import type {
  BuildFormBinding,
  InternalProFormColumnOptions,
  ProFormScope,
} from './interface'
import type { FormItemInstance } from 'element-plus'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'ProFormItem',
})

const props = defineProps<{
  column: InternalProFormColumnOptions<T>
  scope: ProFormScope<T>
  formItemRefMap: BuildFormBinding<T>['formItemRef']
  values: any
}>()

const formItemRef = ref<FormItemInstance | null>(null)

const formItemRefs = toRaw(props).formItemRefMap
formItemRefs?.set(props.column.itemProps!.prop!, formItemRef)

onUnmounted(() => {
  if (!props.column.preserve) {
    props.scope?.removeFields(props.column.itemProps!.prop!)
  }
})

const tooltipIconStyle: CSSProperties = {
  alignSelf: 'center',
  marginLeft: '8px',
  cursor: 'help',
}
</script>
