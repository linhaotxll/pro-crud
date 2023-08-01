import type { ProCrudRequest, TransformResponseResult } from './interface'
import type { FetchTableListRequest } from '../ProTable'

export function callPageList<
  T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F
>(request: ProCrudRequest<T, S, F, R>, form: any): FetchTableListRequest<T> {
  return async query => {
    let resolvedQuery: R = query as R
    if (typeof request.transformQuery === 'function') {
      resolvedQuery = await request.transformQuery({ query, form })
    }

    const response: S = await request.fetchPageList(resolvedQuery)

    let transformRes: TransformResponseResult<any> = null!
    if (typeof request.transformRes === 'function') {
      transformRes = await request.transformRes({
        query: resolvedQuery,
        response,
      })
    } else {
      transformRes = {
        rows: (response as any).data ?? [],
        total: (response as any).total ?? 1,
        pageNumber: query.page.pageNumber,
        pageSize: query.page.pageSize,
      }
    }

    return {
      data: transformRes.rows,
      total: transformRes.total,
    }
  }
}
