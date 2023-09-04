<template>
  <a-form
    ref="formRef"
    v-bind="formProps.value"
    :model="values"
    class="pro-search"
  >
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
            :form-item-ref-map="formItemRef"
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

<style scoped>
.pro-search {
  overflow: hidden;
}
</style>
