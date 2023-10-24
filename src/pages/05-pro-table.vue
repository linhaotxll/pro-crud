<template>
  <pro-table ref="proTableRef" v-bind="proTableBinding" />
</template>

<script lang="tsx" setup>
import axios from 'axios'
import { ref } from 'vue'

import { buildTable } from '~/components/ProTable'

const searchBarShow = ref(false)
// const idColumnShow = ref(true)
// const fixedId = ref(true)
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

const sleep = (time = 2000) => new Promise(r => setTimeout(r, time))
const { proTableRef, proTableBinding } = buildTable<User>(scope => ({
  tableProps: {
    // title: () => <div>222</div>,
    // footer: () => 'footer',
    // expandColumnWidth: 100,
    rowKey: 'id',
  },
  tableSlots: {
    title: () => 'title slot',
    footer: () => 'footer slot',
    // expandColumnTitle: () => <div>+</div>,
    // expandedRowRender: ctx => <div>{ctx.record.address}</div>,
  },
  params,

  columns: [
    // {
    //   label: '序号',
    //   name: 'index',
    //   columnProps: {
    //     width: 100,
    //     fixed: fixedId,
    //   },
    //   columnSlots: {
    //     bodyCell: ctx => ctx.index,
    //   },
    // },

    // {
    //   label: '姓名',
    //   name: 'name',
    //   columnProps: {
    //     resizable: true,
    //     width: 100,
    //   },
    // },

    {
      label: '状态',
      name: 'status',
      type: 'dict-select',
      columnProps: { width: 200 },
      dict: {
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
  ],

  action: {
    show: true,
    actions: {
      edit: {
        text: '编辑',
        show: true,
        props: {
          type: 'primary',
          onClick(_, ctx) {
            // console.log(1, ctx.record.id)
            // debugger
            scope.startEditable(ctx.record.id)
          },
        },
      },
    },
  },

  editable: {},

  async fetchTableData(query) {
    console.log('query: ', query)
    await sleep()
    const result = await axios.get<Data<User>>('/api/user/list', {
      params: {
        ...query.page,
        ...query.params,
        province: query.filters.province?.join(','),
      },
    })
    const { rows, total } = result.data.data
    return { data: rows.slice(0, 1), total: total }
  },

  async submitEditable(values, ctx) {
    const result = await axios.post<boolean>('/api/user/update', {
      // data: {
      userId: ctx.record.id,
      ...values,
      // },
    })

    return !!result.data
  },

  toolbar: {
    actions: {
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
</script>
