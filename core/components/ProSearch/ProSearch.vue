<template>
  <el-form ref="formRef" v-bind="formProps.value" :model="values">
    <el-row v-bind="row.value">
      <template v-for="column in columns">
        <pro-form-item
          v-if="column.value.show"
          :key="column.value.resolvedKey"
          :column="column.value"
          :scope="scope"
          :form-item-ref-map="formItemRef"
          :values="values"
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
import { toRaw } from 'vue'

import { ProFormItem } from '../ProForm'

import type { ProSearchInstance, ProSearchProps } from './interface'

defineOptions({ name: 'ProSearch' })

const props = defineProps<ProSearchProps<T>>()

const formRef = toRaw(props).formRef

defineExpose<ProSearchInstance<T>>({
  ...props.scope,
})
</script>
