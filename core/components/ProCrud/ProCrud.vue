<template>
  <div class="pro-crud">
    <pro-search
      v-if="searchShow"
      ref="proSearchRef"
      v-bind="proSearchBinding"
    />

    <pro-table v-if="tableShow" ref="proTableRef" v-bind="proTableBinding" />
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

import { ProSearchRef, ProTableRef } from './constant'
import { useCrud } from './useCrud'

import type { ProCrudProps, ProCrudInstance } from './interface'

defineOptions({ name: 'ProCrud' })

const proSearchRef = inject(ProSearchRef)
const proTableRef = inject(ProTableRef)

const p = defineProps<ProCrudProps>()

// const { searchBinding, proSearchRef, proTableRef, tableBinding } = useCrud(p)

// console.log('proSearchRef: ', proSearchRef)

// defineExpose<ProCrudInstance>({
//   proSearchRef,
//   proTableRef,
// })
</script>
