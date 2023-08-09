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

const sleep = () => new Promise(r => setTimeout(r, 500))

const showOperate = ref(true)

const rules = {
  name: { required: true, message: '请填写名称' },
}

const formProps = {
  labelWidth: '100px',
  rules,
}

const { proCrudBinding, proCrudRef } = buildCrud<User>(scope => {
  // PageResponseData<User>,
  // UserSearchForm,
  // FetchUserListInput
  return {
    columns: [
      {
        label: '标题',
        prop: 'title',
        search: {
          show: computed(() => {
            return scope.search.getFieldValue('name') === 'IconMan'
          }),
        },
      },

      {
        label: '姓名',
        prop: 'name',
        search: { show: true },
        addForm: {},
      },

      {
        label: '邮件',
        prop: 'email',
        search: { show: true },
        addForm: {},
      },

      { label: '区域', prop: 'region', search: { show: false } },
      { label: '省份', prop: 'province', search: { show: false } },
      { label: '城市', prop: 'city', search: { show: false } },
      { label: '邮编', prop: 'zip', search: { show: false } },

      { label: '描述', prop: 'desc', search: { show: false } },
      { label: 'URL', prop: 'url', search: { show: false } },
      { label: '创建时间', prop: 'createTime', search: { show: false } },
    ],

    form: {
      formProps,
    },

    dialog: {
      props: {
        showClose: false,
        onOpen() {
          console.log('onOpen')
        },
        onOpened() {
          console.log('onOpened')
        },
        onClose() {
          console.log('onClose')
        },
        onClosed() {
          console.log('onClosed')
        },
      },
      is: 'basic-dialog',
    },

    editFormDialog: {
      props: {
        showClose: true,
      },
    },

    addForm: {
      formProps: {
        rules: {
          zip: { required: true, message: '请填写邮政编码' },
        },
      },
    },

    editForm: {
      col: { span: 24 },
      formProps: {},
    },

    // viewForm: {
    //   formProps,
    // },

    table: {
      toolbar: {
        list: {
          add: {
            show: true,
            text: '添加',
            props: {
              onClick() {
                console.log(123)
                scope.addForm.showDialog()
              },
            },
            tooltip: {
              content: '添加',
            },
          },
        },
      },
    },

    search: {
      // initialValues: { name: 'IconMan' },
      buttons: {
        list: {},
      },
    },

    // addForm: {},

    // editForm: {},

    // viewForm: {},

    operates: {
      show: showOperate,
      columnProps: {
        width: 240,
        fixed: 'right',
      },
      buttons: {
        delete: {
          confirmType: 'popconfirm',
          confirmProps: {
            title: 'aaa',
            confirmButtonType: 'primary',
          },
        },
      },
    },

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
        return { rows, total: total }
      },

      async deleteRequest(row) {
        await sleep()

        const response = await axios.post(
          '/api/user/delete',
          { userId: row.id },
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
