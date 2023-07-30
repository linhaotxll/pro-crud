<template>
  <el-button @click="handleAddData">增加</el-button>
  <el-button :type="border ? 'primary' : 'default'" @click="toggleBorder"
    >切换borderd</el-button
  >
  <el-button @click="toggleStripe">切换stripe</el-button>
  <el-button @click="changeName">修改名称</el-button>
  <pro-table ref="proTableRef" v-bind="tableBinding" />
</template>

<script lang="tsx" setup>
import { ref } from 'vue'

import { buildTable } from '~/components/ProTable'

const data = ref<any>([
  { name: Math.random(), age: Math.random() },
  { name: Math.random(), age: Math.random() },
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

const nameLabel = ref('标题')

const { proTableRef, tableBinding } = buildTable(() => ({
  data,
  tableProps: {
    border,
    stripe,
  },
  tableSlots: {
    empty: () => <div>没东西</div>,
    append: () => {
      return <div>合集</div>
    },
  },
  columns: [
    {
      label: nameLabel,
      prop: 'name',
    },
    {
      label: '年龄',
      prop: 'age',
    },
  ],
}))
</script>
