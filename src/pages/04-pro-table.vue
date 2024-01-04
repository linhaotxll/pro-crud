<template>
  <a-space>
    <a-button @click="handleAddData">增加</a-button>
    <a-button :type="bordered ? 'primary' : 'default'" @click="toggleBorder"
      >切换borderd</a-button
    >
    <a-button @click="changeName">修改名称</a-button>
    <a-button @click="changeType">增加宽度</a-button>
  </a-space>

  <pro-table ref="proTableRef" v-bind="proTableBinding" />
</template>

<script lang="tsx" setup>
import { SmileOutlined } from '@ant-design/icons-vue'
import { Tag } from 'ant-design-vue'
import { ref } from 'vue'

import { fetchCashierUserOpen } from '../service'

import { buildTable } from '~/components/ProTable'

const data = ref<any>([
  {
    name: Math.random(),
    age: '26',
    sex: 2,
    status: 1,
    merchant: 'FB13AA5AE74F44B8BF03E3E57FA3BE07',
  },
  { name: Math.random(), age: '27', hasChildren: true },
])
const bordered = ref(false)

function handleAddData() {
  data.value.push({ name: Math.random(), age: Math.random() })
}

function toggleBorder() {
  bordered.value = !bordered.value
}

function changeName() {
  ageLabel.value = ageLabel.value + ageLabel.value
}

function changeType() {
  width.value = width.value + 10
}

const ageLabel = ref('年龄')
const width = ref(100)

interface TableData {
  name: string
  age: number
}

const sleep = (time: number) => new Promise(r => setTimeout(r, time))

const { proTableRef, proTableBinding } = buildTable<TableData>(() => ({
  data,
  tableProps: {
    bordered,
    rowKey: 'name',
  },
  tableSlots: {},
  fetchDictCollection: async () => {
    await sleep(2000)
    return {
      status: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 2 },
      ],
    }
  },
  columns: [
    {
      label: ageLabel,
      name: 'name',
      columnProps: {
        width,
      },
      columnSlots: {
        headerCell() {
          return (
            <span>
              <SmileOutlined />
              <span style="margin-left: 8px">Name</span>
            </span>
          )
        },
        bodyCell(ctx) {
          return <Tag color="pink">{ctx.text}</Tag>
        },
      },
    },
    {
      label: ageLabel,
      name: 'age',
      // columnProps: {
      //   sortable: true,
      //   filters: [
      //     { text: '26', value: '26' },
      //     { text: '27', value: '27' },
      //     { text: '28', value: '28' },
      //     { text: '29', value: '29' },
      //   ],
      //   filterMethod(value, row, column) {
      //     const property = column['property'] as keyof TableData
      //     return row[property] === value
      //   },
      // },
      // columnSlots: {
      //   default: ctx => <div>年龄: {ctx.row.age}</div>,
      //   header: ctx => <div>这是年龄: {ctx.$index}</div>,
      // },
    },
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
}))
</script>
