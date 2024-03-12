<template>
  <ProForm v-bind="proFormBinding" />
</template>

<script lang="tsx" setup>
import { ref } from 'vue'

import { ProForm, buildForm } from '~/index'

const children = ref<any>([
  { label: '用户名', name: 'username' },
  { label: '密码', name: 'password' },
])

const { proFormBinding } = buildForm(scope => {
  return {
    // initialValues: {
    //   list: [{ username: 'admin', password: 'admin123' }],
    // },
    columns: [
      { label: '列表', name: 'list', type: 'list', list: { children } },
    ],
    action: {
      actions: {
        confirm: {
          show: true,
          props: {
            onClick() {
              console.log(111, scope.getFormValues())
            },
          },
        },
      },
    },
  }
})
</script>
