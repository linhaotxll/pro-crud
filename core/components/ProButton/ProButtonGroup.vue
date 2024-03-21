<template>
  <div :style="resolvedStyle">
    <template v-for="btn in resolvedButtons">
      <pro-button v-if="btn.show" :key="btn.key" :config="btn" />
    </template>
  </div>
</template>

<script lang="ts" setup generic="T = Record<string, ActionOption>">
import { merge } from 'lodash-es'
import { computed, toValue } from 'vue'

import { DefaultAction } from './constant'
import ProButton from './ProButton.vue'

import { unRef } from '../common'

import type { ActionOption, ActionsList } from './interface'
import type { CSSProperties, MaybeRef } from 'vue'

defineOptions({ name: 'ProButtonGroup' })

const p = withDefaults(
  defineProps<{
    actions?: ActionsList<T> | undefined
    space?: MaybeRef<number>
  }>(),
  { space: 8 }
)

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

const resolvedStyle = computed<CSSProperties>(() => ({
  display: 'flex',
  gap: `${toValue(p.space ?? 0)}px`,
}))
</script>

<style scoped></style>
