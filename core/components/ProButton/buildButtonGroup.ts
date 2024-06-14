import { ref, watchEffect } from 'vue'

import { DefaultAction, DefaultActionGroup } from './constant'

import { mergeWithTovalue, toValueWithCtx } from '../common'

import type {
  ActionGroupOption,
  ActionsList,
  CustomActions,
  InternalProButtonGroupOptions,
  InternalProButtonOptions,
} from './interface'
import type { MaybeRefOrGetter } from '../common'
import type { Ref, UnwrapRef } from 'vue'

export function buildButtonGroup<T extends CustomActions, R = object>(
  action?: MaybeRefOrGetter<ActionGroupOption<T, R>>,
  defaultAction?: MaybeRefOrGetter<
    ActionGroupOption<CustomActions, Record<string, any>>
  >
) {
  const internalProButtonGroup = ref({}) as Ref<
    InternalProButtonGroupOptions & UnwrapRef<R>
  >

  watchEffect(() => {
    const actionValue: UnwrapRef<ActionGroupOption<T, R>> = mergeWithTovalue(
      {},
      toValueWithCtx(defaultAction),
      toValueWithCtx(action)
    )

    const { show = DefaultActionGroup.show, actions, ...rest } = actionValue

    // 解析是否显示按扭组
    const resolvedShow = toValueWithCtx(show!)

    // @ts-ignore
    const result: InternalProButtonGroupOptions & UnwrapRef<R> = {
      show: resolvedShow,
    }

    if (!resolvedShow) {
      internalProButtonGroup.value = result
      return
    }

    const resolvedActions = toValueWithCtx(actions) as
      | ActionsList<any>
      | undefined

    if (resolvedActions) {
      result.actions = Object.keys(resolvedActions)
        .map<InternalProButtonOptions>(name => {
          return mergeWithTovalue({}, DefaultAction, resolvedActions[name])
        })
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }

    mergeWithTovalue(result, rest)
    internalProButtonGroup.value = result
  })

  return internalProButtonGroup
}
