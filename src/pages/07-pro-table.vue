<template>
  <pro-table v-bind="proTableBinding" />
</template>
<script lang="ts" setup>
import { buildTable } from '~/components/ProTable'

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]

const { proTableBinding } = buildTable(() => {
  return {
    columns: [
      {
        label: 'Name',
        name: 'name',
        key: 'name',
        columnProps: {
          resizable: true,
          width: 150,
        },
      },
      {
        label: 'Age',
        name: 'age',
        key: 'age',
        columnProps: {
          resizable: true,
          width: 100,
          minWidth: 100,
          maxWidth: 200,
        },
      },
      {
        label: 'Address',
        name: 'address',
        key: 'address',
      },
      {
        label: 'Tags',
        key: 'tags',
        name: 'tags',
      },
      {
        label: 'Action',
        key: 'action',
      },
    ],

    data,
  }
})

// const columns = ref<TableColumnsType>([
//   {
//     dataIndex: 'name',
//     key: 'name',
//     resizable: true,
//     width: 150,
//   },
//   {
//     title: 'Age',
//     dataIndex: 'age',
//     key: 'age',
//     resizable: true,
//     width: 100,
//     minWidth: 100,
//     maxWidth: 200,
//   },
//   {
//     title: 'Address',
//     dataIndex: 'address',
//     key: 'address',
//   },
//   {
//     title: 'Tags',
//     key: 'tags',
//     dataIndex: 'tags',
//   },
//   {
//     title: 'Action',
//     key: 'action',
//   },
// ])

// const c1 = computed(() => [reactive({ name: 'IconMan' })])
// console.log(1, c1.value[0])
// function handleResizeColumn(w: number, col: TableColumnType) {
//   console.log(1, col)
//   col.width = w
// }
</script>
