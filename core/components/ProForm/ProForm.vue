<template>
  <a-form ref="formRef" v-bind="formProps.value" :model="values">
    <a-row v-bind="row.value">
      <template v-for="column in columns">
        <a-col
          v-if="column.value.show"
          v-bind="column.value.col"
          :key="column.value.resolvedKey"
        >
          <pro-form-item
            :column="column.value"
            :scope="scope"
            :values="values"
          />
        </a-col>
      </template>

      <a-col v-if="actions.value.show" v-bind="actions.value.col">
        <a-form-item>
          <pro-button-group
            :actions="actions.value.list"
            :space="actions.value.space"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup generic="T extends object">
import { toRaw } from 'vue'

import ProFormItem from './ProFormItem.vue'

import { ProButtonGroup } from '../ProButton'

import type { ProFormInstance } from './interface'
import type { ProFormProps } from './interface'

defineOptions({
  name: 'ProForm',
})

const p = defineProps<ProFormProps<T>>()
const formRef = toRaw(p).formRef

defineExpose<ProFormInstance<T>>({
  ...p.scope,
})
</script>
