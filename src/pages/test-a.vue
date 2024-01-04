<template>
  <pro-crud v-bind="proCrudBinding" />
</template>

<script lang="ts" setup>
import { fetchCashierUserOpen } from '../service'

import { buildCrud } from '~/index'

const sleep = (time: number) => new Promise(r => setTimeout(r, time))

const { proCrudBinding } = buildCrud<any>(() => {
  return {
    fetchDictCollection: async () => {
      await sleep(2000)

      return {
        // cashier: (await fetchCashierUserOpen()).userOpenList,
        status: [
          { label: '开启', value: 1 },
          { label: '关闭', value: 2 },
        ],
      }
    },

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
            // debugger
            const res = await fetchCashierUserOpen()
            return res.data.userOpenList
          },
          labelField: 'company',
          valueField: 'appId',
        },
      },
    ],

    // addRequest: form => createMenu({ body: form }),
    // editRequest: form => updateMenu({ body: form }),
    // deleteRequest: ctx => deleteMenu({ params: `${ctx.record.menuId}` }),
  }
})
</script>
