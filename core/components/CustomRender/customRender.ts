import { h, resolveComponent } from 'vue'

import { isFunction, isString } from '../../utils'

import type { CustomRender } from './interface'

export function buildCustomRender<Context = any>(
  options: CustomRender<Context>
) {
  const { render, is: Component, context } = options

  if (isFunction(render)) {
    return render(context)
  }

  if (Component) {
    if (isString(Component)) {
      return h(resolveComponent(Component), context)
    }
    return h(Component, { context })
  }
}
