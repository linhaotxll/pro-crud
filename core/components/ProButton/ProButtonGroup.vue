<template>
  <template v-for="(btn, key) in list">
    <el-button v-if="btn?.show" v-bind="btn.props" :key="key">
      <pro-render v-if="btn.slots?.default" :render="btn.slots.default" />
      <span v-else-if="btn.text">{{ btn.text }}</span>

      <template v-if="btn.slots?.icon" #icon>
        <pro-render :render="btn.slots.icon" />
      </template>

      <template v-if="btn.slots?.loading" #loading>
        <pro-render :render="btn.slots.loading" />
      </template>
    </el-button>
  </template>
</template>

<script lang="ts" setup>
import type { ButtonsOption } from '../ProForm'

defineOptions({ name: 'ProButtonGroup' })

defineProps<{
  list: ButtonsOption['list']
}>()
</script>
