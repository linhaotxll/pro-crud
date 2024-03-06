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
const initialValues = { username: 'admin', password: 'admin123' }

function handleClickSubmit() {
  scope.submit()
}

function handleClickSet() {
  scope.setFieldValues({
    gender: '1',
  })
}

function handleClickShow() {
  show.value = !show.value
}

const time = Date.now()

const { proFormBinding } = buildForm(_scope => {
  scope = _scope
  return {
    columns: [
      {
        label: '用户名',
        name: 'username',
        transform: {
          to(formValue) {
            return formValue + time
          },
        },
      },
      { label: '密码', name: 'password', submitted: false },
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
