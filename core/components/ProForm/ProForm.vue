<template>
  <a-form ref="formRef" v-bind="formProps.value" :model="values">
    <template v-for="column in columns">
      <pro-form-item
        v-if="column.value.show"
        :key="column.value.resolvedKey"
        :column="column.value"
        :scope="scope"
        :form-item-ref-map="formItemRef"
        :values="values"
      />
    </template>

    <a-form-item
      v-if="buttons.value.show"
      :wrapper-col="buttons.value.wrapperCol"
    >
      <pro-button-group :config="buttons.value" />
    </a-form-item>
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
