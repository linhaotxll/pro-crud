<template>
  <a-form-item ref="formItemRef" v-bind="column.itemProps">
    <template #label>
      <pro-render
        v-if="column.itemSlots?.label"
        :render="column.itemSlots.label"
        :ctx="column"
      />
      <span v-else>{{ column.label }}</span>

      <a-tooltip v-if="column.tooltip" v-bind="column.tooltip">
        <pro-render
          v-if="column.tooltip.slots?.default"
          :render="column.tooltip.slots.default"
          :ctx="tooltipIconStyle"
        />
        <question-circle-outlined v-else :style="tooltipIconStyle" />

        <template v-if="column.tooltip.slots?.title" #title>
          <pro-render :render="column.tooltip.slots.title" />
        </template>
      </a-tooltip>
    </template>

    <template v-if="column.itemSlots?.help" #help="ctx">
      <pro-render :render="column.itemSlots.help" :ctx="ctx" />
    </template>

    <dynamic-v-model :column="column" :values="values" :scope="scope" />
  </a-form-item>
</template>

<script lang="ts" setup generic="T extends object">
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { onUnmounted, ref } from 'vue'

import DynamicVModel from './DynamicVModel.vue'

import { unRef } from '../common'

import type { InternalProFormColumnOptions, ProFormScope } from './interface'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'ProFormItem',
})

const props = defineProps<{
  column: InternalProFormColumnOptions<T>
  scope: ProFormScope<T>
  values: any
}>()

const formItemRef = ref<any | null>(null)

init()

onUnmounted(() => {
  const name = unRef(props.column.itemProps?.name)
  if (!props.column.preserve && name) {
    props.scope?.removeFields(name)
  }
})

function init() {
  const name = unRef(props.column.itemProps?.name)
  if (name) {
    props.scope.setFieldInstance(name, formItemRef)
  }
}

const tooltipIconStyle: CSSProperties = {
  alignSelf: 'center',
  marginLeft: '8px',
  cursor: 'help',
}
</script>
