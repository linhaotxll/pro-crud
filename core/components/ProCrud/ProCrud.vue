<template>
  <div class="pro-crud">
    <pro-search
      v-if="searchShow.value"
      ref="proSearchRef"
      v-bind="searchBinding"
    />

    <pro-table v-if="tableShow.value" ref="proTableRef" v-bind="tableBinding" />

    <el-dialog v-if="addFormShow.value" v-bind="addFormDialog.value">
      <pro-form ref="addFormRef" v-bind="addFormBinding"></pro-form>
    </el-dialog>
  </div>
</template>

<script
  lang="ts"
  setup
  generic=" T extends object,
  S extends object = any,
  F extends object = any,
  R extends object = F"
>
import { inject } from 'vue'

import { AddFormRef, ProSearchRef, ProTableRef } from './constant'

import type { ProCrudProps } from './interface'

defineOptions({ name: 'ProCrud' })

const proSearchRef = inject(ProSearchRef)
const proTableRef = inject(ProTableRef)
const addFormRef = inject(AddFormRef)

defineProps<ProCrudProps<T, S, F, R>>()
</script>
