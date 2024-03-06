<template>
  <button @click="handleClickSubmit">submit</button>
  <ProForm v-bind="proFormBinding" />
</template>

<script lang="tsx" setup>
import { ref } from 'vue'

import { ProForm, buildForm } from '~/index'

import type { ProFormScope } from '~/index'

let scope!: ProFormScope<any>
const show = ref(false)

function handleClickSubmit() {
  scope.submit()
}
const time = Date.now()

const { proFormBinding } = buildForm(_scope => {
  scope = _scope
  return {
    columns: [
      {
        label: 'text',
        name: 'username',
      },
      { label: 'auto-complete', name: 'password', type: 'auto-complete' },
      { label: 'cascader', name: 'cascader', type: 'cascader' },
      { label: 'date', name: 'date', type: 'date' },
      { label: 'date-week', name: 'date-week', type: 'date-week' },
      { label: 'date-month', name: 'date-month', type: 'date-month' },
      { label: 'date-quarter', name: 'date-quarter', type: 'date-quarter' },
      { label: 'date-year', name: 'date-year', type: 'date-year' },
      { label: 'date-range', name: 'date-range', type: 'date-range' },
      {
        label: 'date-month-range',
        name: 'date-month-range',
        type: 'date-month-range',
      },
      {
        label: 'date-time',
        name: 'date-time',
        type: 'date-time',
      },
      {
        label: 'date-time-range',
        name: 'date-time-range',
        type: 'date-time-range',
      },
      {
        label: 'time',
        name: 'time',
        type: 'time',
      },
      {
        label: 'time-range',
        name: 'time-range',
        type: 'time-range',
      },
      {
        label: 'dict-select',
        name: 'dict-select',
        type: 'dict-select',
      },
    ],
    submitRequest() {
      return true
    },
    successRequest() {
      console.log('successRequest')
    },
    validateFail() {
      console.log('validateFail')
    },
    beforeSubmit() {
      console.log('beforeSubmit')
    },
    formProps: {
      rules: {
        username: { required: true, message: '请填写用户名', min: 2 },
      },
    },
  }
})
</script>
