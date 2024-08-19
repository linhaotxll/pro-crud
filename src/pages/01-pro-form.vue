<script lang="ts" setup>
import { buildCrud } from '~/index'

const sleep = (time = 1000) => new Promise(r => setTimeout(r, time))

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

    fetchTableData() {
      return [{ name: 'IcomMan', age: 24 }]
    },
    editRequest() {
      // debugger
      return sleep(2000).then(() => {
        return true
      })
    },
    // editToast: {
    //   type: 'message',
    //   props: {
    //     content: 'edit success',
    //     duration: 100,
    //   },
    // },
    addRequest() {
      // debugger
      return sleep(2000).then(() => {
        return true
      })
    },
    deleteRequest() {
      return sleep(2000).then(() => {
        return true
      })
    },
    // addToast: {
    //   type: 'message',
    //   props: {
    //     content: 'add success',
    //     duration: 100,
    //   },
    // },
  }
})
</script>

<template>
  <pro-crud class="h-full" v-bind="proCrudBinding" />
</template>
