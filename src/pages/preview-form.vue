<template>
  <el-select v-model="value" class="m-2" placeholder="Select" size="large">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref, triggerRef } from 'vue'

const value = ref('4')

const options = ref<any>([])

const sleep = (time = 3000) => new Promise(r => setTimeout(r, time))

onMounted(() => {
  sleep().then(() => {
    options.value = [
      {
        value: '1',
        label: 'Option1',
      },
      {
        value: '2',
        label: 'Option2',
      },
      {
        value: '3',
        label: 'Option3',
      },
      {
        value: '4',
        label: 'Option4',
      },
      {
        value: '5',
        label: 'Option5',
      },
    ]

    triggerRef(value)
  })
})
</script>
