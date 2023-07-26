<template>
  <!-- <dynamic-v-model :values="values" :prop="prop" /> -->
  <el-input v-model="value" />

  <pre>{{ values }}</pre>
</template>

<script lang="ts" setup>
import { get, set } from 'lodash-es'
import { computed, reactive } from 'vue'

const prop = 'info.name'

const values = reactive({
  info: { name: 'IconMan' },
})

// console.log(get(values, 'info'))

const value = computed({
  get() {
    return get(values, prop)
  },
  set(newValue) {
    set(values, prop, newValue)
    //
  },
})
</script>
