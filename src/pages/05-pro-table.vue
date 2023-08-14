<template>
  <!-- <div>
    <div>222</div>
  </div> -->

  <el-button @click="searchBarShow = !searchBarShow">切换 search bar</el-button>
  <el-button @click="idColumnShow = !idColumnShow">切换 id 列</el-button>
  <el-button @click="fixedId = !fixedId">固定Id列</el-button>
  <el-button @click="changeParams">修改params</el-button>

  <pro-table ref="proTableRef" v-bind="proTableBinding" />
</template>

<script lang="tsx" setup>
import axios from 'axios'
import { ref } from 'vue'

import { buildTable } from '~/components/ProTable'

const border = ref(false)
const stripe = ref(true)
const searchBarShow = ref(false)
const idColumnShow = ref(true)
const fixedId = ref(true)
const params = ref({ age: 24 })

interface User {
  id: string
  name: string
  desc: string
  createTime: string
  address: string
}

interface Data<T> {
  data: {
    pageNumber: number
    pageSize: number
    total: number
    rows: T[]
  }
}

function changeParams() {
  params.value = { age: ++params.value.age }
}

const sleep = (time = 2000) => new Promise(r => setTimeout(r, time))
const { proTableRef, proTableBinding } = buildTable<User>(() => ({
  tableProps: {
    border,
    stripe,
    lazy: true,
    rowKey: 'id',
    width: '100%',
    // height: 'auto',
    // maxHeight: '100%',
  },
  tableSlots: {
    empty: () => <div>没东西</div>,
    append: () => {
      return <div>合集</div>
    },
  },
  params,
  loading: ref({
    text: ref('加载中'),
  }),
  pagination: {
    defaultPageSize: 20,
    defaultCurrentPage: 3,
  },
  columns: [
    {
      label: '序号',
      prop: 'index',
      columnProps: {
        type: 'index',
        width: 100,
        fixed: fixedId,
      },
    },
    {
      label: 'Id',
      prop: 'id',
      show: idColumnShow,
    },
    {
      label: '姓名',
      prop: 'name',
    },
    {
      label: '标题',
      prop: 'title',
      columnProps: {
        width: 300,
      },
    },
    {
      label: '地址',
      prop: 'url',
      columnProps: {
        width: 200,
      },
    },
    {
      label: '邮件',
      prop: 'email',
      columnProps: {
        width: 200,
      },
    },
    {
      label: '区域',
      prop: 'region',
    },
    {
      label: '省',
      prop: 'province',
    },
    {
      label: '城市',
      prop: 'city',
    },
    {
      label: '邮政编码',
      prop: 'zip',
    },
    {
      label: '住址',
      prop: 'address',
      columnProps: {
        width: 200,
      },
    },

    {
      label: '状态',
      prop: 'status',
      type: 'dict',
      columnProps: { width: 200 },
      dict: {
        // data: [
        //   { label: '状态一', value: 1 },
        //   { label: '状态儿', value: 2 },
        //   { label: '状态三', value: 3 },
        // ],

        async fetchData() {
          await sleep(5000)

          return [
            { label: '状态一', value: 1 },
            { label: '状态儿', value: 2 },
            { label: '状态三', value: 3 },
          ]
        },
      },
    },

    {
      label: '创建时间',
      prop: 'createTime',
    },
    {
      label: '描述',
      prop: 'desc',
      columnProps: {
        width: 500,
      },
    },
  ],
  request: {
    async fetchTableData(query) {
      await sleep()
      const result = await axios.get<Data<User>>('/api/user/list', {
        params: { ...query.page, ...query.params },
      })
      const { rows, total } = result.data.data
      return { data: rows, total: total }
    },
  },

  toolbar: {
    list: {
      search: {
        props: {
          icon: 'Refresh',
        },
        tooltip: {
          show: searchBarShow,
          content: '搜索',
        },
      },
    },
  },
}))

console.log('proTableBinding: ', proTableBinding)
</script>
