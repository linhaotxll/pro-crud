<template>
  <div>
    <el-input
      :model-value="values.name"
      placeholder="名称"
      @input="handleChangeName"
    />
    <el-input
      :model-value="values.age"
      placeholder="年龄"
      @input="handleChangeAge"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import type { InternalProFormColumnOptions } from '~/index'

interface PersonInfo {
  name?: string
  age?: string
}

defineOptions({ name: 'BasicInfo' })

const p = defineProps<{
  column: InternalProFormColumnOptions<any>
  modelValue?: PersonInfo
}>()

const values = computed<PersonInfo>(() => ({
  name: p.modelValue?.name,
  age: p.modelValue?.age,
}))

const emit = defineEmits<{
  (type: 'update:modelValue', value: PersonInfo): void
}>()

function handleChangeName(name: string) {
  emit('update:modelValue', { name, age: p.modelValue?.age })
}

function handleChangeAge(age: string) {
  emit('update:modelValue', { age, name: p.modelValue?.name })
}

// const value = defineModel<PersonInfo>({ default: {} })
</script>
