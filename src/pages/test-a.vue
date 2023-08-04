<template>
  <el-button @click="handleChageNameProp">Change Name Prop</el-button>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column :prop="nameProp" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    age: 24,
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    age: 18,
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    age: 12,
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    age: 22,
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const nameProp = ref('name')

function handleChageNameProp() {
  nameProp.value = nameProp.value === 'name' ? 'age' : 'name'
}
</script>
