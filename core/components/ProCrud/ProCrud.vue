<template>
  <div class="pro-crud">
    <pro-search ref="proSearchRef" v-bind="searchBinding" />

    <pro-table ref="proTableRef" v-bind="tableBinding" />
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
import { useCrud } from './useCrud'

import type { ProCrudProps, ProCrudInstance } from './interface'

defineOptions({ name: 'ProCrud' })

const p = defineProps<ProCrudProps<T, S, F, R>>()

const { searchBinding, proSearchRef, proTableRef, tableBinding } = useCrud(p)

console.log('proSearchRef: ', proSearchRef)

defineExpose<ProCrudInstance>({
  proSearchRef,
  proTableRef,
})
</script>
