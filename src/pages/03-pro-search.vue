<script lang="ts" setup>
import { onMounted } from 'vue'

import { fetchCashierUserOpen } from '../service'

import { buildSearch } from '~/index'

defineOptions({ name: 'ProSearch03Demo' })

// 提交表单
async function handleSubmit() {
  return false
}

const sleep = (time: number) => new Promise(r => setTimeout(r, time))

const { proSearchBinding } = buildSearch<any>(scope => {
  onMounted(() => {
    scope.submit()
  })

  return {
    columns: [
      {
        label: '性别',
        name: 'sex',
        type: 'dict-select',
        dict: {
          data: [
            { label: '男', value: 1 },
            { label: '女', value: 2 },
          ],
        },
      },

      {
        label: '状态',
        name: 'status',
        type: 'dict-select',
        dict: {
          useCollect(dictSet) {
            return dictSet?.status ?? []
          },
        },
      },

      {
        label: '商户',
        name: 'merchant',
        type: 'dict-select',
        dict: {
          fetchData: async () => {
            const res = await fetchCashierUserOpen()
            return res.data.userOpenList
          },
          labelField: 'company',
          valueField: 'appId',
        },
      },
    ],

    submitRequest: handleSubmit,
    fetchDictCollection: async () => {
      await sleep(2000)
      return {
        status: [
          { label: '开启', value: 1 },
          { label: '关闭', value: 2 },
        ],
      }
    },
  }
})
</script>

<template>
  <div class="h-full flex flex-col">
    <pro-search v-bind="proSearchBinding" />
  </div>
</template>
