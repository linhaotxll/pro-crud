export type Middleware<C> = (ctx: C, next: () => void) => unknown
export function compose<C = any>(middlewares: Middleware<C>[]) {
  return function (ctx: C, next?: () => void) {
    return dispatch(0)

    function dispatch(i: number): any {
      const middleware = i === middlewares.length ? next : middlewares[i]
      return middleware?.(ctx, dispatch.bind(null, i + 1))
    }
  }
}
