<template>
  <ProForm v-bind="proFormBinding" />

  <button @click="handleUpdate">update</button>
  <pre style="color: #000000">formState: {{ formState }}</pre>
</template>

<script lang="tsx" setup>
import { computed, ref } from 'vue'

import { ProForm, buildForm } from '~/index'

import type { ProFormScope } from '~/index'

const children = ref<any>([
  { label: '用户名', name: 'username' },
  { label: '密码', name: 'password' },
])

let formScope: ProFormScope

const formState = computed(() => JSON.stringify(formScope.getFormValues()))

const options = ref([
  { label: '男', value: 1 },
  { label: '女', value: 2 },
])

function handleUpdate() {
  options.value = [
    { label: '孙悟空', value: 3 },
    { label: '贝吉塔', value: 4 },
    { label: '孙悟饭', value: 5 },
  ]
}

const { proFormBinding } = buildForm(scope => {
  formScope = scope
  return {
    // initialValues: {
    //   list: [{ username: 'admin', password: 'admin123' }],
    // },
    columns: [
      // { label: '列表', name: 'list', type: 'list', list: { children } },
      {
        label: '性别',
        name: 'sex',
        type: 'select',
        dict: {
          data: options,
        },
      },
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
