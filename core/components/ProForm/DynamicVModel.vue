<template>
  <div class="dynamic-v-model" :class="{ fill: column.fill }">
    <template v-if="ValueTypeMap.value[column.type!].form?.is">
      <component
        :is="ValueTypeMap.value[column.type!].form!.is"
        v-model:[vModelName]="vModel"
        :column="column"
        v-bind="column.resolvedProps"
      >
        <template
          v-for="(render, name) in column.fieldSlots"
          :key="name"
          #[name]="ctx"
        >
          <pro-render :render="render" :ctx="ctx" />
        </template>
      </component>
    </template>
    <template v-else-if="ValueTypeMap.value[column.type].form?.render">
      <pro-render
        :render="ValueTypeMap.value[column.type].form?.render"
        :ctx="{ vModel: getVModel(), column }"
      />
    </template>
  </div>
</template>

<script lang="ts" setup generic="T extends object">
import { get, set } from 'lodash-es'
import { computed, toRaw } from 'vue'

import { ValueTypeMap, unRef } from '../common'

import type { InternalProFormColumnOptions } from './interface'

const props = defineProps<{
  column: InternalProFormColumnOptions<T>
  values: any
}>()

const formValues = toRaw(props).values

defineOptions({ name: 'DynamicVModel' })

const vModelName = computed(
  () => ValueTypeMap.value[props.column.type!].form!.vModelName ?? 'value'
)

function getVModel() {
  return vModel
}

const vModel = computed({
  get() {
    const name = unRef(props.column.itemProps!.name)
    return name ? get(formValues, name) : undefined
  },
  set(newValue) {
    const name = unRef(props.column.itemProps!.name)
    if (name) {
      set(formValues, name, newValue)
    }
  },
})
</script>

<style scoped>
.dynamic-v-model {
  width: 100%;
}

.dynamic-v-model.fill :deep(.ant-input),
.dynamic-v-model.fill :deep(.ant-select),
.dynamic-v-model.fill :deep(.ant-input-number),
.dynamic-v-model.fill :deep(.ant-picker) {
  width: 100%;
  box-sizing: border-box;
}
</style>
