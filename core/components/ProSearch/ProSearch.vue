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

import { ProButtonGroup } from '../ProButton'
import { ProFormItem } from '../ProForm'

import type { ProSearchInstance, ProSearchProps } from './interface'

defineOptions({ name: 'ProSearch' })

const props = defineProps<ProSearchProps<T>>()

const formRef = toRaw(props).formRef

defineExpose<ProSearchInstance<T>>({
  ...props.scope,
})
</script>
