<template>
  <pro-table ref="proTableRef" v-bind="proTableBinding" />
</template>

<script lang="tsx" setup>
import axios from 'axios'
import { ref } from 'vue'

import { buildTable } from '~/components/ProTable'

const searchBarShow = ref(false)
// const idColumnShow = ref(true)
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
    {
      label: '序号',
      name: 'index',
      columnProps: {
        width: 100,
        fixed: fixedId,
      },
      columnSlots: {
        bodyCell: ctx => ctx.index,
      },
    },
    // {
    //   label: 'Id',
    //   name: 'id',
    //   show: idColumnShow,
    //   // columnProps: { width: 100 },
    // },
    {
      label: '姓名',
      name: 'name',
      columnProps: {
        resizable: true,
        width: 100,
      },
    },
    // {
    //   label: '标题',
    //   name: 'title',
    //   columnProps: {
    //     width: 300,
    //   },
    // },
    // {
    //   label: '地址',
    //   name: 'url',
    //   columnProps: {
    //     width: 200,
    //   },
    // },
    // {
    //   label: '邮件',
    //   name: 'email',
    //   columnProps: {
    //     width: 200,
    //   },
    // },
    // {
    //   label: '区域',
    //   name: 'region',
    //   columnProps: {
    //     width: 200,
    //   },
    // },
    // {
    //   label: '省',
    //   name: 'province',
    //   columnProps: {
    //     filters: [
    //       { text: '甘肃省', value: '甘肃省' },
    //       { text: '浙江省', value: '浙江省' },
    //     ],
    //     width: 100,
    //   },
    // },
    // {
    //   label: '城市',
    //   name: 'city',
    //   columnProps: {
    //     width: 200,
    //   },
    // },
    // {
    //   label: '邮政编码',
    //   name: 'zip',
    //   columnProps: {
    //     width: 200,
    //   },
    //   columnSlots: {
    //     bodyCell: ctx => <Tag>{ctx.text}</Tag>,
    //   },
    // },
    // {
    //   label: '住址',
    //   name: 'address',
    //   columnProps: {
    //     width: 200,
    //   },
    // },

    {
      label: '状态',
      name: 'status',
      type: 'dict-select',
      columnProps: { width: 200 },
      dict: {
        // data: [
        //   { label: '状态一', value: 1 },
        //   { label: '状态儿', value: 2 },
        //   { label: '状态三', value: 3 },
        // ],

        async fetchData() {
          await sleep(500)

          return [
            { label: '状态一', value: 1 },
            { label: '状态儿', value: 2 },
            { label: '状态三', value: 3 },
          ]
        },
      },
    },

    // {
    //   label: '创建时间',
    //   name: 'createTime',
    //   columnProps: {
    //     width: 200,
    //   },
    // },
    // {
    //   label: '描述',
    //   name: 'desc',
    //   columnProps: {
    //     width: 500,
    //   },
    // },
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
            console.log(1, ctx)
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
    return { data: rows, total: total }
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
</script>
