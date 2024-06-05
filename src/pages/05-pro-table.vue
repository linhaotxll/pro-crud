<template>
  <button @click="setValue">set</button>
  <pro-table v-bind="proTableBinding" />
</template>

<script lang="tsx" setup>
import { h, ref } from 'vue'

import { buildTable } from '~/components/ProTable'

type Person = {
  name: string
  age: number
}

const vi = {
  fn(func: any) {
    return func
  },
}

function setValue() {
  renderFilterDropdown.value = renderFilterDropdownFn
  renderFilterIcon.value = renderFilterIconFn
  renderNameFilterIcon.value = renderNameFilterIconFn
  renderNameFilterDropdown.value = renderNameFilterDropdownFn
}

// normal filter
const renderFilterDropdownFn = () =>
  h('div', { class: 'filter-dropdown' }, `dropdown text`)

const renderFilterDropdown = ref()

const renderFilterIconFn = () => h('div', { class: 'filter-icon' }, `icon text`)

const renderFilterIcon = ref()

// name filter
const renderNameFilterDropdownFn = () =>
  h('div', { class: 'name-filter-dropdown' }, `name dropdown text`)

const renderNameFilterDropdown = ref()

const renderNameFilterIconFn = () =>
  h('div', { class: 'name-filter-icon' }, `name icon text`)

const renderNameFilterIcon = ref()

const data = ref<Person[]>([{ name: 'IconMan', age: 24 }])
const { proTableBinding } = buildTable<Person>(() => {
  return {
    columns: [
      {
        label: '姓名',
        name: 'name',
        renderFilterDropdown: renderNameFilterDropdown,
        renderFilterIcon: renderNameFilterIcon,
        columnProps: { customFilterDropdown: true },
      },
      {
        label: '年龄',
        name: 'age',
      },
    ],
    data,
    renderFilterDropdown() {
      return '123'
    },
    renderFilterIcon() {
      return 'icon111'
    },
  }
})
</script>
