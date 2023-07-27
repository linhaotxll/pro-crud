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

      <dynamic-v-model :column="column" />
    </el-form-item>
  </el-col>
</template>

<script lang="ts" setup generic="T extends object">
import { Warning } from '@element-plus/icons-vue'
import { inject, onUnmounted } from 'vue'
import { ref } from 'vue'

import { ProFormScopeKey } from './constant'
import { FormItemRefKey } from './constant'

import type { InternalProFormColumnOptions } from './interface'
import type { FormItemInstance } from 'element-plus'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'ProFormItem',
})

const props = defineProps<{
  column: InternalProFormColumnOptions<T>
}>()

const formItemRef = ref<FormItemInstance | null>(null)

const scope = inject(ProFormScopeKey)

const formItemRefs = inject(FormItemRefKey)
formItemRefs?.set(props.column.prop, formItemRef)

onUnmounted(() => {
  if (!props.column.preserve) {
    scope?.removeFields(props.column.prop)
  }
})

const tooltipIconStyle: CSSProperties = {
  alignSelf: 'center',
  marginLeft: '8px',
  cursor: 'help',
}
</script>
