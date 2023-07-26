<template>
  <!-- <input v-model="value" /> -->
  <component
    :is="valueTypeMap[column.type!][0]"
    v-model="vModel"
    v-bind="column"
  />
</template>

<script lang="ts" setup>
import { get, set } from 'lodash-es'
import { computed } from 'vue'
import { inject } from 'vue'

import { valueTypeMap } from './ProForm'
import { ProFormValueKey } from './ProForm'

import type { InternalProFormColumnOptions } from './ProForm'

const props = defineProps<{
  column: InternalProFormColumnOptions
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
