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

    <dynamic-v-model :column="column" :values="values" />
  </a-form-item>
</template>

<script lang="ts" setup generic="T extends object">
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { onUnmounted, toRaw, ref } from 'vue'

import DynamicVModel from './DynamicVModel.vue'

import type {
  BuildFormBinding,
  InternalProFormColumnOptions,
  ProFormScope,
} from './interface'
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

const formItemRef = ref<any | null>(null)

const formItemRefs = toRaw(props).formItemRefMap
if (props.column.itemProps!.name) {
  formItemRefs?.set(props.column.itemProps!.name, formItemRef)
}

onUnmounted(() => {
  if (!props.column.preserve && props.column.itemProps!.name) {
    props.scope?.removeFields(props.column.itemProps!.name)
  }
})

const tooltipIconStyle: CSSProperties = {
  alignSelf: 'center',
  marginLeft: '8px',
  cursor: 'help',
}
</script>
