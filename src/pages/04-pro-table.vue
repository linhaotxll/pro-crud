<template>
  <el-button @click="handleAddData">增加</el-button>
  <el-button :type="border ? 'primary' : 'default'" @click="toggleBorder"
    >切换borderd</el-button
  >
  <el-button @click="toggleStripe">切换stripe</el-button>
  <el-button @click="changeName">修改名称</el-button>
  <el-button @click="changeType">增加宽度</el-button>
  <pro-table
    ref="proTableRef"
    v-bind="proTableBinding"
    style="margin-top: 16px"
  />
</template>

<script lang="tsx" setup>
import { ref } from 'vue'

import { buildTable } from '~/components/ProTable'

const data = ref<any>([
  { name: Math.random(), age: '26' },
  { name: Math.random(), age: '27', hasChildren: true },
])
const border = ref(false)
const stripe = ref(true)

function handleAddData() {
  data.value.push({ name: Math.random(), age: Math.random() })
}

function toggleBorder() {
  border.value = !border.value
}

function toggleStripe() {
  stripe.value = !stripe.value
}

function changeName() {
  nameLabel.value = nameLabel.value + nameLabel.value
}

function changeType() {
  width.value = width.value + 10
}

const nameLabel = ref('标题')
const width = ref(100)

interface TableData {
  name: string
  age: number
}

const { proTableRef, proTableBinding } = buildTable<TableData>(() => ({
  data,
  tableProps: {
    border,
    stripe,
    lazy: true,
    rowKey: 'name',
    load(_, __, resolve) {
      setTimeout(() => {
        resolve([
          {
            name: '王五',
            age: 24,
          },
          {
            name: '马六',
            age: 26,
          },
        ])
      }, 1000)
    },
    treeProps: {
      children: 'children',
      hasChildren: 'hasChildren',
    },

    defaultSort: {
      prop: 'age',
      order: 'ascending',
    },

    onSelect(s, row) {
      console.log('select', s, row)
    },
    onSelectAll: s => {
      console.log('select all: ', s)
    },
    onSelectionChange: s => {
      console.log('select change: ', s)
    },
    // onCellMouseEnter: (row, column, cell, event) => {
    //   // console.log('cell mouse enter: ', row, column, cell, event)
    // },

    onCellClick: (...args) => {
      console.log('cell click: ', ...args)
    },

    onCellDblclick: (...args) => {
      console.log('cell db click: ', ...args)
    },

    onRowClick: (...args) => {
      console.log('row click: ', ...args)
    },

    onSortChange: (...args) => {
      console.log('sort change: ', ...args)
    },

    onFilterChange: (...args) => {
      console.log('filter change: ', ...args)
    },

    onHeaderDragend(...args) {
      console.log('drag header: ', ...args)
    },

    onExpandChange(...args) {
      console.log('expand: ', ...args)
    },
  },
  tableSlots: {
    empty: () => <div>没东西</div>,
    append: () => {
      return <div>合集</div>
    },
  },
  columns: [
    // {
    //   label: '',
    //   prop: 'expand',
    //   columnProps: {
    //     // type: 'expand',
    //     // width: 100,
    //   },
    //   // columnSlots: {
    //   //   default: props => {
    //   //     return (
    //   //       <div>
    //   //         <div></div>
    //   //         <p>Age: {props.row.age}</p>
    //   //         <p>Name: {props.row.name}</p>
    //   //         <h3>Family</h3>
    //   //       </div>
    //   //     )
    //   //   },
    //   // },
    // },
    {
      label: nameLabel,
      prop: 'name',
      columnProps: {
        width,
      },
    },
    {
      label: '年龄',
      prop: 'age',
      columnProps: {
        sortable: true,
        filters: [
          { text: '26', value: '26' },
          { text: '27', value: '27' },
          { text: '28', value: '28' },
          { text: '29', value: '29' },
        ],
        filterMethod(value, row, column) {
          const property = column['property'] as keyof TableData
          return row[property] === value
        },
      },
      columnSlots: {
        default: ctx => <div>年龄: {ctx.row.age}</div>,
        header: ctx => <div>这是年龄: {ctx.$index}</div>,
      },
    },
  ],
}))
</script>
