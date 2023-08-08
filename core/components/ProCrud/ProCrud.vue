<template>
  <div class="pro-crud">
    <pro-search
      v-if="searchShow.value"
      ref="proSearchRef"
      v-bind="searchBinding"
    />

    <pro-table v-if="tableShow.value" ref="proTableRef" v-bind="tableBinding" />

    <el-dialog v-if="addFormShow.value" v-bind="addFormDialog.value">
      <pro-form ref="addFormRef" v-bind="addFormBinding" />

      <template #footer>
        <pro-button-group :list="addFormBinding.buttons.value.list" />
      </template>
    </el-dialog>

    <el-dialog v-if="editFormShow.value" v-bind="editFormDialog.value">
      <pro-form ref="editFormRef" v-bind="editFormBinding" />

      <template #footer>
        <pro-button-group :list="editFormBinding.buttons.value.list" />
      </template>
    </el-dialog>

    <el-dialog v-if="viewFormShow.value" v-bind="viewFormDialog.value">
      <pro-form ref="viewFormRef" v-bind="viewFormBinding" />

      <template #footer>
        <pro-button-group :list="viewFormBinding.buttons.value.list" />
      </template>
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
// const editFormRef = inject(EddFormRef)

defineProps<ProCrudProps<T, S, F, R>>()
</script>
