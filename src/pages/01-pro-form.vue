<template>
  <ProForm v-bind="proFormBinding" />

  <button @click="handleSetCol">Set Col</button>
  <button @click="handleSetACtion">Set Action</button>
  <button @click="reset">Reset</button>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'

import { buildForm } from '~/index'

const initialNameColSpan = 2
const initialActionColSpan = 3
const nameCol = ref({ span: initialNameColSpan })
const actionCol = ref({ span: initialActionColSpan })

const { proFormBinding } = buildForm(() => {
  return {
    formProps: { layout: 'inline' },
    columns: [
      {
        label: '姓名',
        name: 'name',
        col: nameCol,
      },
    ],
    action: {
      col: actionCol,
    },
  }
})

function handleSetCol() {
  nameCol.value.span++
}

function handleSetACtion() {
  actionCol.value.span++
}

function reset() {
  actionCol.value = { span: initialActionColSpan }
  nameCol.value = { span: initialNameColSpan }
}
</script>
