<template>
  <pro-crud ref="proCrudRef" v-bind="proCrudBinding" />
</template>

<script lang="tsx" setup>
import axios from 'axios'
import { computed, ref } from 'vue'

// import BasicDialog from '../components/BasicDialog.vue'

import { buildCrud } from '~/components/ProCrud'

// 用户信息
interface User {
  id: string
  name: string
  desc: string
  createTime: string
  address: string
}

// 用户接口响应
type UserResponse = ResponseData<PageResponseData<User>>

interface ResponseData<T> {
  data: T
  code: number
}

interface PageResponseData<T> {
  rows: T[]
  total: number
}

// 查询列表入参
export interface FetchUserListInput extends UserSearchForm {
  pageNumber: number
  pageSize: number
}

interface UserSearchForm {
  name?: string
}

const sleep = (time = 1000) => new Promise(r => setTimeout(r, time))

// const showOperate = ref(true)

const rules = {
  name: { required: true, message: '请填写名称' },
}

const formProps = {
  rules,
}

const addFormShow = ref(false)

const { proCrudBinding, proCrudRef } = buildCrud<
  User,
  PageResponseData<User>,
  UserSearchForm,
  FetchUserListInput
>(scope => {
  return {
    search: {
      // row: { gutter: 0 },
    },

    columns: [
      {
        label: '标题',
        name: 'title',
        search: {
          show: computed(() => {
            return scope.search.getFieldValue('name') === 'IconMan'
          }),
        },
      },

      {
        label: '姓名',
        name: 'name',
        search: { show: true },
        addForm: {},
      },

      {
        label: '邮件',
        name: 'email',
        search: { show: true },
        addForm: {},
      },

      {
        label: '状态',
        name: 'status',
        type: 'dict-select',
        search: { show: true },
        addForm: {},
        dict: {
          async fetchData() {
            console.log('请求状态接口')
            await sleep(5000)

            return [
              { label: '状态一', value: 1 },
              { label: '状态儿', value: 2 },
              { label: '状态三', value: 3 },
            ]
          },
        },
      },

      { label: '区域', name: 'region', search: { show: false } },
      { label: '省份', name: 'province', search: { show: false } },
      { label: '城市', name: 'city', search: { show: false } },
      { label: '邮编', name: 'zip', search: { show: false } },

      { label: '描述', name: 'desc', search: { show: false } },
      { label: 'URL', name: 'url', search: { show: false } },
      { label: '创建时间', name: 'createTime', search: { show: false } },
    ],

    form: {
      formProps,
      toast: false,
    },

    editToast: '编辑666',

    dialog: {
      props: {
        // showClose: false,
        // onOpen() {
        //   console.log('onOpen')
        // },
        // onOpened() {
        //   console.log('onOpened')
        // },
        // onClose() {
        //   console.log('onClose')
        // },
        // onClosed() {
        //   console.log('onClosed')
        // },
      },
    },

    action: {
      actions: {
        edit: { show: false },
      },
      // edit: { show: false },
      // a: {},
      // edit: {},
      // actions: {
      //   edit: {},
      // },
    },

    addForm: { show: addFormShow },

    table: {
      toolbar: {
        // show: false,
        actions: {
          reload: { show: false },
        },
      },
    },

    // editFormDialog: {
    //   props: {
    //     showClose: true,
    //   },
    // },

    // addForm: {
    //   formProps: {
    //     rules: {
    //       zip: { required: true, message: '请填写邮政编码' },
    //     },
    //   },
    // },

    // editForm: {
    //   col: { span: 24 },
    //   formProps: {},
    // },

    // table: {
    //   toolbar: {
    //     list: {
    //       add: {
    //         show: true,
    //         text: '添加',
    //         props: {
    //           onClick() {
    //             console.log(123)
    //             scope.addForm.showDialog()
    //           },
    //         },
    //         tooltip: {
    //           content: '添加',
    //         },
    //       },
    //     },
    //   },
    // },

    // search: {
    //   // initialValues: { name: 'IconMan' },
    //   buttons: {
    //     list: {},
    //   },
    // },

    // actions: {},

    request: {
      transformQuery(options) {
        return {
          pageSize: options.query.page.pageSize,
          pageNumber: options.query.page.pageNumber,
          name: options.form.name,
        }
      },

      transformResponse(options) {
        return {
          data: options.response.rows,
          total: options.response.total,
        }
      },

      async fetchPaginationData(query) {
        await sleep()
        const result = await axios.get<UserResponse>('/api/user/list', {
          params: query,
        })

        const { rows, total } = result.data.data
        return { rows, total }
      },

      async deleteRequest({ record }) {
        await sleep()

        const response = await axios.post(
          '/api/user/delete',
          { userId: record.id },
          { headers: { 'Content-Type': 'application/json' } }
        )
        return !!response.data.data
      },

      async addRequest(form) {
        await sleep()
        const response = await axios.post('/api/user/add', form)
        return !!response.data.data
      },

      async editRequest({ id, ...rest }) {
        await sleep()
        const response = await axios.post('/api/user/update', {
          userId: id,
          ...rest,
        })
        return !!response.data.data
      },
    },
  }
})
</script>
