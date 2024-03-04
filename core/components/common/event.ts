import type { EventHandler } from 'ant-design-vue/es/_util/EventInterface'

export function invokeEventHandler(
  handler?: EventHandler | EventHandler[],
  ...ctx: any
) {
  if (handler) {
    if (Array.isArray(handler)) {
      handler.forEach(handle => handle(...ctx))
    } else {
      handler(...ctx)
    }
  }
}
