<template>
  <el-form ref="formRef" v-bind="formProps" :model="values">
    <el-row v-bind="row">
      <template v-for="column in resolvedColumns">
        <pro-form-item
          v-if="column.value.show"
          :key="column.value.resolvedKey"
          :column="column.value"
        />
      </template>

      <el-col v-if="resolvedButtons.show" v-bind="resolvedButtons.col">
        <el-form-item>
          <template v-for="(btn, key) in resolvedButtons.list">
            <el-button v-if="btn?.show" v-bind="btn.props" :key="key">
              <pro-render
                v-if="btn.slots?.default"
                :render="btn.slots.default"
              />
              <span v-else-if="btn.text">{{ btn.text }}</span>

              <template v-if="btn.slots?.icon" #icon>
                <pro-render :render="btn.slots.icon" />
              </template>

              <template v-if="btn.slots?.loading" #loading>
                <pro-render :render="btn.slots.loading" />
              </template>
            </el-button>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup generic="T extends object, R">
import { inject } from 'vue'

import { DefaultPreserve, ProFormValueKey } from './constant'
import { useForm } from './useForm'

import type { ProFormInstance, ProFormOptions } from './interface'

const values = inject(ProFormValueKey)

defineOptions({
  name: 'ProForm',
})

const props = withDefaults(defineProps<ProFormOptions<T, R>>(), {
  preserve: DefaultPreserve,
  row: () => ({ gutter: 16 }),
  col: () => ({ span: 24 }),
})

const {
  resolvedColumns,
  resolvedButtons,
  formProps,
  row,
  formRef,
  submit,
  reset,
  setFieldValue,
  setFieldValues,
  getFieldValue,
  removeFields,
  validate,
  validateField,
  resetFields,
  scrollToField,
  clearValidate,
  getFieldInstance,
} = useForm(props, values)

defineExpose<ProFormInstance>({
  submit,
  reset,
  setFieldValue,
  setFieldValues,
  getFieldValue,
  removeFields,
  validate,
  validateField,
  resetFields,
  scrollToField,
  clearValidate,
  getFieldInstance,
})
</script>
