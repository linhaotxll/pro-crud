export type NextMiddleware = () => void
export type Middleware<C> = (ctx: C, next: NextMiddleware) => unknown

export function compose<C = any>(middlewares: Middleware<C>[]) {
  return function (ctx: C, next?: NextMiddleware) {
    return dispatch(0)

    function dispatch(i: number): any {
      const middleware = i === middlewares.length ? next : middlewares[i]
      return middleware?.(ctx, dispatch.bind(null, i + 1))
    }
  }
}
