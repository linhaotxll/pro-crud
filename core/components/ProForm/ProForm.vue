<template>
  <el-form ref="formRef" v-bind="formProps.value" :model="values">
    <el-row v-bind="row.value">
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

      <el-col v-if="buttons.value.show" v-bind="buttons.value.col">
        <el-form-item>
          <pro-button-group :list="buttons.value.list" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup generic="T extends object">
import { toRaw } from 'vue'

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
