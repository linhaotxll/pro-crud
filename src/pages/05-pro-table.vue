<template>
  <pro-table v-bind="proTableBinding" />
</template>

<script lang="tsx" setup>
import { ref } from 'vue'

import { buildTable } from '~/components/ProTable'

import type { Ref } from 'vue'

type Person = {
  name: string
  age: number
}

const stack: Person[] = [
  { name: 'IconMan', age: 24 },
  { name: 'Nicholas', age: 25 },
]

const defaultPerson: Person = {
  name: 'Edwards',
  age: 26,
}

const sleep = (time: number) => new Promise(r => setTimeout(r, time))

// const data = ref([]) as Ref<Person[]>
const { proTableBinding } = buildTable<Person>(() => {
  return {
    columns: [
      {
        label: '姓名',
        name: 'name',
        renderCell(ctx) {
          return `姓名是${ctx.text}`
        },
      },
      {
        label: '年龄',
        name: 'age',
        renderCell(ctx) {
          return `年龄是${ctx.text}`
        },
      },
    ],
    async fetchTableData() {
      await sleep(10000)
      return [{ name: 'IconMan', age: 24 }]
    },
    // renderEmptyText: () => 'empty',
    // search: false,
    // defaultData: [defaultPerson],
    // data: [],
  }
})
</script>
