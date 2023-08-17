<template>
  <a-space v-bind="config.space">
    <template v-for="(btn, key) in config.list">
      <a-button v-if="btn?.show" v-bind="btn.props" :key="key">
        <pro-render v-if="btn.slots?.default" :render="btn.slots.default" />
        <span v-else-if="btn.text">{{ btn.text }}</span>

        <!-- <template v-if="btn.slots?.icon" #icon>
          <pro-render :render="btn.slots.icon" />
        </template> -->
      </a-button>
    </template>
  </a-space>
</template>

<script lang="ts" setup>
import type { ButtonsOption } from '../ProForm'

defineOptions({ name: 'ProButtonGroup' })

defineProps<{
  config: ButtonsOption
}>()
</script>
