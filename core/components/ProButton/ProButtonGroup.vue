<template>
  <a-space v-bind="resolvedSpace">
    <template v-for="btn in resolvedButtons">
      <pro-button v-if="btn.show" :key="btn.key" :config="btn" />
    </template>
  </a-space>
</template>

<script lang="ts" setup generic="T = Record<string, ActionOption>">
import { merge } from 'lodash-es'
import { computed } from 'vue'

import { DefaultAction } from './constant'
import ProButton from './ProButton.vue'

import { unRef } from '../common'

import type { ActionOption, ActionsList } from './interface'
import type { ExtractMaybeRef } from '../common'
import type { SpaceProps } from 'ant-design-vue'
import type { MaybeRef } from 'vue'

defineOptions({ name: 'ProButtonGroup' })

const p = defineProps<{
  actions?: ActionsList<T> | undefined
  space?: MaybeRef<ExtractMaybeRef<SpaceProps>>
}>()

const resolvedButtons = computed(() => {
  const actions = p.actions
  const result = actions
    ? Object.keys(actions)
        .reduce<(ActionOption & { key: string })[]>((prev, key) => {
          const action = merge({ key }, DefaultAction, actions![key])
          if (!unRef(action.show)) {
            return prev
          }

          prev.push(action)
          return prev
        }, [])
        .sort((prev, next) => unRef(prev.order!) - unRef(next.order!))
    : []

  return result
})

const resolvedSpace = computed<SpaceProps | null>(() => {
  const space = unRef(p.space)
  const result = space
    ? Object.keys(space).reduce((prev, key) => {
        // @ts-ignore
        prev[key] = unRef(space[key])
        return prev
      }, {})
    : null

  return result
})
</script>
