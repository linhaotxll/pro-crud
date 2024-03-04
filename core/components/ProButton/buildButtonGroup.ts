import { ref, toValue, watchEffect } from 'vue'

import { DefaultAction, DefaultActionGroup } from './constant'

import { mergeWithTovalue, type MaybeRef } from '../common'

import type {
  ActionGroupOption,
  ActionOption,
  ActionsList,
  InternalProButtonGroupOptions,
  InternalProButtonOptions,
} from './interface'
import type { Ref } from 'vue'

export function buildButtonGroup<
  T extends Record<string, MaybeRef<ActionOption>>
>(action: MaybeRef<ActionGroupOption<T>>) {
  const internalProButtonGroup = ref({}) as Ref<InternalProButtonGroupOptions>

  watchEffect(() => {
    const actionValue = toValue(action)

    const { show = DefaultActionGroup.show, actions, ...rest } = actionValue

    // 解析是否显示按扭组
    const resolvedShow = toValue(show!)

    const result: InternalProButtonGroupOptions = {
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
