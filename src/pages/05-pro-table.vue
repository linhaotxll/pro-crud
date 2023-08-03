<template>
  <!-- <div>
    <div>222</div>
  </div> -->

  <el-button @click="searchBarShow = !searchBarShow">切换 search bar</el-button>
  <el-button @click="idColumnShow = !idColumnShow">切换 id 列</el-button>

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

const sleep = () => new Promise(r => setTimeout(r, 2000))
const { proTableRef, proTableBinding } = buildTable<User>(() => ({
  tableProps: {
    border,
    stripe,
    lazy: true,
    rowKey: 'id',
    // height: 'auto',
    // maxHeight: '100%',
  },
  tableSlots: {
    empty: () => <div>没东西</div>,
    append: () => {
      return <div>合集</div>
    },
  },
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
      columnProps: { type: 'index', width: 100 },
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
      label: '住址',
      prop: 'address',
      // columnSlots: {
      //   default: ctx => <el-tag>{ctx.row.address}</el-tag>,
      // },
    },
    {
      label: '创建时间',
      prop: 'createTime',
    },
    {
      label: '描述',
      prop: 'desc',
    },
  ],
  request: {
    async fetchTableData(query) {
      await sleep()
      const result = await axios.get<Data<User>>('/api/user/list', {
        params: query.page,
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
