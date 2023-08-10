<template>
  <template v-if="ValueTypeMap.value[column.type!].form?.is">
    <component
      :is="ValueTypeMap.value[column.type!].form!.is"
      v-model="vModel"
      :column="column"
      v-bind="column.fieldProps"
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
</template>

<script lang="ts" setup generic="T extends object">
import { get, set } from 'lodash-es'
import { computed, toRaw } from 'vue'

import { ValueTypeMap } from '../common'

import type { InternalProFormColumnOptions } from './interface'

const props = defineProps<{
  column: InternalProFormColumnOptions<T>
  values: any
}>()

const formValues = toRaw(props).values

defineOptions({ name: 'DynamicVModel' })

function getVModel() {
  return vModel
}

const vModel = computed({
  get() {
    return get(formValues, props.column.itemProps!.prop!)
  },
  set(newValue) {
    set(formValues, props.column.itemProps!.prop!, newValue)
  },
})
</script>
