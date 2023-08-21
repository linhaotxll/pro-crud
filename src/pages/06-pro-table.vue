<template>
  <pro-table ref="proTableRef" v-bind="proTableBinding" />
</template>

<script lang="tsx" setup>
import axios from 'axios'
import { ref } from 'vue'

import { buildTable } from '~/components/ProTable'

const searchBarShow = ref(false)

const params = ref({ age: 24 })

interface User {
  key: number
  name: string
  age: number
  street: string
  building: string
  number: number
  companyAddress: string
  companyName: string
  gender: string
}

interface Data<T> {
  data: {
    pageNumber: number
    pageSize: number
    total: number
    rows: T[]
  }
}

const data = [...Array(100)].map<User>((_, i) => ({
  key: i,
  name: 'John Brown',
  age: i + 1,
  street: 'Lake Park',
  building: 'C',
  number: 2035,
  companyAddress: 'Lake Street 42',
  companyName: 'SoftLake Co',
  gender: 'M',
}))

const sleep = (time = 2000) => new Promise(r => setTimeout(r, time))
const { proTableRef, proTableBinding } = buildTable<User>(() => ({
  tableProps: {
    rowKey: 'id',
    bordered: true,
  },
  tableSlots: {
    title: () => 'title slot',
    footer: () => 'footer slot',
    // expandColumnTitle: () => <div>+</div>,
    // expandedRowRender: ctx => <div>{ctx.record.address}</div>,
  },
  params,

  data,

  columns: [
    {
      label: 'Name',
      name: 'name',
      columnProps: {
        width: 100,
        fixed: true,
        filters: [
          {
            text: 'Joe',
            value: 'Joe',
          },
          {
            text: 'John',
            value: 'John',
          },
        ],
      },
    },

    {
      label: 'Other',
      children: [
        {
          label: 'Title',
          name: 'age',
          columnProps: {
            width: 200,
          },
        },

        {
          label: 'Address',
          children: [
            {
              label: 'Street',
              name: 'street',
              columnProps: {
                width: 200,
              },
            },

            {
              label: 'Block',
              name: 'block',
              children: [
                {
                  label: 'Building',
                  name: 'building',
                  columnProps: {
                    width: 100,
                  },
                },
                {
                  label: 'Door No.',
                  name: 'number',
                  columnProps: {
                    width: 100,
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    {
      label: 'Company',
      children: [
        {
          label: 'Company Address',
          name: 'companyAddress',
          columnProps: { width: 200 },
        },
        {
          label: 'Company Name',
          name: 'companyName',
          columnProps: { width: 200 },
        },
      ],
    },

    {
      label: 'Gender',
      name: 'gender',
      columnProps: { width: 80, fixed: 'right' },
    },
  ],

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
