import { ref, toValue, watchEffect } from 'vue'

import { DefaultAction, DefaultActionGroup } from './constant'

import { mergeWithTovalue, type MaybeRef } from '../common'

import type {
  ActionGroupOption,
  ActionsList,
  CustomActions,
  InternalProButtonGroupOptions,
  InternalProButtonOptions,
} from './interface'
import type { Ref, UnwrapRef } from 'vue'

export function buildButtonGroup<T extends CustomActions, R = object>(
  action: MaybeRef<ActionGroupOption<T, R>>
) {
  const internalProButtonGroup = ref({}) as Ref<
    InternalProButtonGroupOptions & UnwrapRef<R>
  >

  watchEffect(() => {
    const actionValue = toValue(action)

    const { show = DefaultActionGroup.show, actions, ...rest } = actionValue

    // 解析是否显示按扭组
    const resolvedShow = toValue(show!)

    // @ts-ignore
    const result: InternalProButtonGroupOptions & UnwrapRef<R> = {
      show: resolvedShow,
    }

    if (!resolvedShow) {
      internalProButtonGroup.value = result
      return
    }

    const actionsValue = toValue(actions)
    const resolvedActions: ActionsList<any> | undefined = actionsValue
      ? mergeWithTovalue({}, actionsValue)
      : undefined
    result.actions = resolvedActions
      ? Object.keys(resolvedActions)
          .map<InternalProButtonOptions>(name => {
            return mergeWithTovalue({}, DefaultAction, resolvedActions[name])
          })
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      : undefined

    mergeWithTovalue(result, rest)
    internalProButtonGroup.value = result
  })

  return internalProButtonGroup
}
