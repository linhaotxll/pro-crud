<template>
  <!-- <input v-model="value" /> -->
  <component
    :is="valueTypeMap[column.type!][0]"
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

<script lang="ts" setup generic="T extends object">
import { get, set } from 'lodash-es'
import { computed } from 'vue'
import { inject } from 'vue'

import { ProFormValueKey } from './constant'
import { valueTypeMap } from './type'

import type { InternalProFormColumnOptions } from './interface'

const props = defineProps<{
  column: InternalProFormColumnOptions<T>
}>()

const formValues = inject(ProFormValueKey)

defineOptions({ name: 'DynamicVModel' })

const vModel = computed({
  get() {
    return get(formValues, props.column.prop)
  },
  set(newValue) {
    set(formValues, props.column.prop, newValue)
  },
})
</script>
