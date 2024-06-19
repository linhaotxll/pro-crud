import { ref, toValue, watchEffect } from 'vue'

import { DefaultAction, DefaultActionGroup } from './constant'

import { mergeWithTovalue } from '../common'

import type {
  ActionGroupOption,
  ActionsList,
  CustomActions,
  InternalProButtonGroupOptions,
  InternalProButtonOptions,
} from './interface'
import type { MaybeRefOrGetter, Ref, UnwrapRef } from 'vue'

export function buildButtonGroup<T extends CustomActions, R = object, C = any>(
  action?: MaybeRefOrGetter<ActionGroupOption<T, R>>,
  defaultAction?: MaybeRefOrGetter<
    ActionGroupOption<CustomActions, Record<string, any>>
  >,
  ctx?: C
) {
  const internalProButtonGroup = ref({}) as Ref<
    InternalProButtonGroupOptions & UnwrapRef<R>
  >

  watchEffect(() => {
    internalProButtonGroup.value = _buildButtonGroup(action, defaultAction, ctx)
  })

  return internalProButtonGroup
}

export function buildButtonGroupInRender<
  T extends CustomActions,
  R = object,
  C = any
>(
  action?: MaybeRefOrGetter<ActionGroupOption<T, R>>,
  defaultAction?: MaybeRefOrGetter<
    ActionGroupOption<CustomActions, Record<string, any>>
  >,
  ctx?: C
) {
  return _buildButtonGroup(action, defaultAction, ctx)
}

function _buildButtonGroup<T extends CustomActions, R = object, C = any>(
  action?: MaybeRefOrGetter<ActionGroupOption<T, R>>,
  defaultAction?: MaybeRefOrGetter<
    ActionGroupOption<CustomActions, Record<string, any>>
  >,
  ctx?: C
) {
  const actionValue: UnwrapRef<ActionGroupOption<T, R>> = mergeWithTovalue(
    {},
    toValue(defaultAction),
    toValue(action)
  )

  const { show = DefaultActionGroup.show, actions, ...rest } = actionValue

  // 解析是否显示按扭组
  const resolvedShow = toValue(show!)

  // @ts-ignore
  const result: InternalProButtonGroupOptions & UnwrapRef<R> = {
    show: resolvedShow,
  }

  if (!resolvedShow) {
    return result
  }

  const resolvedActions = toValue(actions) as ActionsList<any> | undefined

  if (resolvedActions) {
    result.actions = Object.keys(resolvedActions)
      .map<InternalProButtonOptions>(name => {
        return mergeWithTovalue({ ctx }, DefaultAction, resolvedActions[name])
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  mergeWithTovalue(result, rest)
  return result
}
