<template>
  <el-form ref="formRef" v-bind="formProps" :model="values">
    <el-row v-bind="row">
      <template v-for="column in resolvedColumns">
        <pro-form-item
          v-if="column.value.show"
          :key="column.value.resolvedKey"
          :column="column.value"
        />
      </template>

      <el-col v-if="searchButtons.show" v-bind="searchButtons.col">
        <el-form-item>
          <template v-for="(btn, key) in searchButtons.list">
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

<script lang="ts" setup generic="T extends object, R = T">
import { inject, computed } from 'vue'

import { unRef } from '../common'
import {
  DefaultPreserve,
  ProFormValueKey,
  useValues,
  useForm,
} from '../ProForm'

import type { ProSearchOptions, ProSearchInstance } from './interface'
import type { ButtonsOption, ElColProps } from '../ProForm'

defineOptions({ name: 'ProSearch' })

const defaultColSpan = 4

const props = withDefaults(defineProps<ProSearchOptions<T, R>>(), {
  preserve: DefaultPreserve,
  col: () => ({ span: defaultColSpan }),
  row: () => ({ gutter: 16 }),
})

const values = inject(
  ProFormValueKey,
  () => useValues(props.initialValues, props.columns),
  true
)

const { resolvedColumns, resolvedButtons, formProps, row, formRef, ...rest } =
  useForm(
    {
      ...props,
      toast: props.toast ?? false,
      buttons: { col: { span: 4 }, ...props.buttons },
    },
    values
  )

const searchButtons = computed<
  Omit<ButtonsOption, 'col'> & { col: ElColProps }
>(() => {
  const resolved = resolvedButtons.value
  const { span = 4 } = unRef(resolved.col) ?? {}
  const total = resolvedColumns.reduce<number>((prev, columnComputed) => {
    const column = columnComputed.value
    const columnCol = unRef(column.col!)

    const columnTotal =
      (columnCol.span ?? defaultColSpan) + (columnCol.offset ?? 0)

    const result = prev + columnTotal

    if (result > 24) {
      prev = 0
    }

    prev += columnTotal

    return prev
  }, 0)

  let offset = 0
  const residueSpan = 24 - total
  if (residueSpan < span) {
    offset = 24 - span
  } else {
    offset = 24 - total - span
  }

  return {
    show: resolved.show,
    col: {
      span,
      offset,
    },
    list: {
      ...resolved.list,
      reset: {
        show: true,
        text: '重置',
        props: {
          onClick: () => {
            rest.resetFields()
          },
        },
      },
    },
  }
})

defineExpose<ProSearchInstance<T>>({
  ...rest,
})
</script>
