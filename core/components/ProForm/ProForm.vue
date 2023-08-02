<template>
  <el-form ref="formRef" v-bind="formProps" :model="values">
    <el-row v-bind="row">
      <template v-for="column in columns">
        <pro-form-item
          v-if="column.value.show"
          :key="column.value.resolvedKey"
          :column="column.value"
        />
      </template>

      <el-col v-if="buttons.value.show" v-bind="buttons.value.col">
        <el-form-item>
          <template v-for="(btn, key) in buttons.value.list">
            <el-button v-if="btn?.show" v-bind="btn.props" :key="key">
              <pro-render
                v-if="btn.slots?.default"
                :render="btn.slots.default"
              />
              <span v-else-if="btn.text">{{ btn.text }}</span>

              <template v-if="btn.slots?.icon" #icon>
                <pro-render :render="btn.slots.icon" />
              </template>

              <template v-if="btn.slots?.loading" #loading>
                <pro-render :render="btn.slots.loading" />
              </template>
            </el-button>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup generic="T extends object">
import { inject } from 'vue'

import { ProFormRefKey } from './constant'

import type { ProFormInstance } from './interface'
import type { ProFormProps } from './interface'

const formRef = inject(ProFormRefKey)

defineOptions({
  name: 'ProForm',
})

const p = defineProps<ProFormProps<T>>()

defineExpose<ProFormInstance<T>>({
  ...p.scope,
})
</script>
