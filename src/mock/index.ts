import Mock from 'mockjs'

import type { MockMethod } from 'vite-plugin-mock'

const Random = Mock.Random

const userList = Array.from({ length: 431 }).map(() => ({
  id: Random.id(),
  address: Random.province(),
  region: Random.region(),
  province: Random.province(),
  city: Random.city(),
  zip: Random.zip(),
  title: Random.title(),
  url: Random.url(),
  email: Random.email(),
  name: Random.name(),
  createTime: Random.date(),
  desc: Random.csentence(),
}))

const mock: MockMethod[] = [
  {
    url: '/api/user/list',
    method: 'get',
    response(opt) {
      const { pageSize, pageNumber, name } = opt.query

      const newDataList = userList.filter(
        user => user.name === (name || user.name)
      )

      return {
        code: 200,
        data: {
          pageNumber,
          pageSize,
          rows: newDataList.slice(
            (pageNumber - 1) * pageSize,
            pageNumber * pageSize
          ),
          total: newDataList.length,
        },
      }
    },
  },

  {
    url: '/api/user/delete',
    method: 'post',
    response(opt) {
      const { userId } = opt.body

      const deleteIndex = userList.findIndex(user => user.id === userId)

      if (deleteIndex !== -1) {
        userList.splice(deleteIndex, 1)
      }

      return {
        code: 200,
        data: deleteIndex !== -1,
      }
    },
  },

  {
    url: '/api/user/add',
    method: 'post',
    response(opt) {
      const data = opt.body

      userList.unshift(data as any)

      return {
        code: 200,
        data: true,
      }
    },
  },

  {
    url: '/api/user/update',
    method: 'post',
    response(opt) {
      const { userId, ...rest } = opt.body

      const updateIndex = userList.findIndex(user => user.id === userId)
      if (updateIndex !== -1) {
        userList.splice(updateIndex, 1, { id: userId, ...rest } as any)
      }

      return {
        code: 200,
        data: updateIndex !== -1,
      }
    },
  },
]

export default mock
