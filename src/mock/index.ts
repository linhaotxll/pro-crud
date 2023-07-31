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
      const { pageSize, pageNumber } = opt.query
      console.log('mock: ', pageSize, pageNumber)
      // const len = userList.length / pageSize
      // const totalPages =
      //   len - parseInt(`${len}`) > 0 ? parseInt(`${len}`) + 1 : len
      const newDataList = userList.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize
      )

      return {
        data: {
          pageNumber,
          pageSize,
          rows: newDataList,
          total: userList.length,
        },
      }
    },
  },
]

export default mock
