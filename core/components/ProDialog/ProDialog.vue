<template>
  <component :is="dialogProps?.is" v-bind="dialogProps?.props">
    <pro-form v-bind="formProps" />

    <template #header>
      <div class="el-dialog__title">
        <div>{{ dialogProps?.props?.title }}</div>
      </div>
    </template>

    <template #footer>
      <pro-button-group
        :actions="formProps?.actions.value.list"
        :space="formProps?.actions.value.space"
      />
    </template>
  </component>
</template>

<script lang="ts" setup>
import { watch } from 'vue'

import { ProButtonGroup } from '../ProButton'

import type { CrudDialogOption } from '../ProCrud'
import type { BuildSearchBinding } from '../ProSearch/interface'

defineOptions({ name: 'ProDialog' })

const p = defineProps<{
  dialogProps?: CrudDialogOption | undefined
  formProps?: BuildSearchBinding<any> | undefined
}>()

watch(
  () => p.formProps,
  f => {
    console.log(666, f?.actions.value)
  }
)
</script>
