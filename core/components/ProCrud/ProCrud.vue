<template>
  <div class="pro-crud">
    <pro-search
      v-if="searchShow.value"
      ref="proSearchRef"
      v-bind="searchBinding"
    />

    <pro-table v-if="tableShow.value" ref="proTableRef" v-bind="tableBinding" />

    <pro-dialog
      v-if="addFormShow.value"
      :dialog-props="addFormDialog.value"
      :form-props="addFormBinding"
    />

    <pro-dialog
      v-if="editFormShow.value"
      :dialog-props="editFormDialog.value"
      :form-props="editFormBinding"
    />

    <pro-dialog
      v-if="viewFormShow.value"
      :dialog-props="viewFormDialog.value"
      :form-props="viewFormBinding"
    />
  </div>
</template>

<script
  lang="ts"
  setup
  generic=" T extends object,
S extends object,
A extends object,
E extends object"
>
import { inject } from 'vue'

import { ProSearchRef, ProTableRef } from './constant'

import { ProDialog } from '../ProDialog'

import type { ProCrudProps } from './interface'

defineOptions({ name: 'ProCrud' })

const proSearchRef = inject(ProSearchRef)
const proTableRef = inject(ProTableRef)

defineProps<ProCrudProps<T, S, A, E>>()
</script>
