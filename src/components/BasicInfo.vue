<template>
  <div>
    <a-input
      :value="values.name"
      placeholder="名称"
      @input="handleChangeName"
    />
    <a-input :value="values.age" placeholder="年龄" @input="handleChangeAge" />
  </div>
</template>

<script lang="ts" setup>
import { Form } from 'ant-design-vue'
import { computed } from 'vue'

import type { InternalProFormColumnOptions } from '~/index'

interface PersonInfo {
  name?: string
  age?: string
}

defineOptions({ name: 'BasicInfo' })

const p = defineProps<{
  column: InternalProFormColumnOptions<any>
  value?: PersonInfo
}>()

const formItemContext = Form.useInjectFormItemContext()
console.log('formItemContextL ;', formItemContext)

const values = computed<PersonInfo>(() => ({
  name: p.value?.name,
  age: p.value?.age,
}))

const emit = defineEmits<{
  (type: 'update:value', value: PersonInfo): void
}>()

function handleChangeName(e: Event) {
  // @ts-ignore
  emit('update:value', { name: e.target!.value, age: p.value?.age })
}

function handleChangeAge(e: EvalError) {
  // @ts-ignore
  emit('update:value', { age: e.target!.value, name: p.value?.name })
}

// const value = defineModel<PersonInfo>({ default: {} })
</script>
