import Mock from 'mockjs'

import type { MockMethod } from 'vite-plugin-mock'

const Random = Mock.Random

const userList = Array.from({ length: 431 }).map(() => ({
  id: Random.id(),
  address: Random.province(),
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
]

export default mock
