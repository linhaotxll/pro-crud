<template>
  <ProCrud v-bind="proCrudBinding" />
</template>

<script lang="tsx" setup>
import { buildCrud } from '~/index'

const sleep = (time: number) => new Promise(r => setTimeout(r, time))

const { proCrudBinding } = buildCrud(() => {
  return {
    columns: [
      {
        label: '姓名',
        name: 'name',
      },
      {
        label: '年龄',
        name: 'age',
        type: 'digit',
      },
    ],

    async fetchTableData() {
      await sleep(1000)
      return [
        {
          name: 'IconMan',
          age: 24,
        },
      ]
    },

    editRequest() {
      debugger
      return true
    },
  }
})
</script>
