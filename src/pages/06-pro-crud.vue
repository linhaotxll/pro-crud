<template>
  <pro-crud ref="proCrudRef" v-bind="crudBinding" />
</template>

<script lang="tsx" setup>
import axios from 'axios'

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

const sleep = () => new Promise(r => setTimeout(r, 2000))

const { crudBinding, proCrudRef } = buildCrud<
  User,
  PageResponseData<User>,
  UserSearchForm,
  FetchUserListInput
>(() => ({
  columns: [
    { label: '姓名', prop: 'name', search: { show: true } },
    { label: '描述', prop: 'desc', search: { show: false } },
    { label: '地址', prop: 'address', search: { show: false } },
    { label: '创建时间', prop: 'createTime', search: { show: false } },
  ],

  table: {},

  search: {
    // initialValues: { name: 'Ronald Hall' },
  },

  addForm: {},

  editForm: {},

  viewForm: {},

  request: {
    transformQuery(options) {
      console.log('optinos: ', options)
      return {
        pageSize: options.query.page.pageSize,
        pageNumber: options.query.page.pageNumber,
        name: options.form.name,
      }
    },

    transformRes(options) {
      return {
        rows: options.response.rows,
        total: options.response.total,
        pageNumber: options.query.pageNumber,
        pageSize: options.query.pageSize,
      }
    },

    async fetchPageList(query) {
      await sleep()
      const result = await axios.get<UserResponse>('/api/user/list', {
        params: query,
      })

      const { rows, total } = result.data.data
      return { rows, total: total }
    },
  },
}))
</script>
