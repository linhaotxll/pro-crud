<template>
  <div class="dynamic-v-model" :class="{ fill: column.fill }">
    <template v-if="ValueTypeMap.value[column.type!].form?.is">
      <component
        :is="ValueTypeMap.value[column.type!].form!.is"
        v-model:[vModelName]="vModel"
        :column="column"
        :scope="scope"
        :form-values="values"
        v-bind="column.resolvedProps"
      >
        <template
          v-for="(render, name) in column.fieldSlots"
          :key="name"
          #[name]="ctx"
        >
          <pro-render :render="render" :ctx="ctx" />
        </template>
      </component>
    </template>
    <template v-else-if="ValueTypeMap.value[column.type].form?.render">
      <pro-render
        :render="ValueTypeMap.value[column.type].form?.render"
        :ctx="{ vModel: getVModel(), column }"
      />
    </template>
  </div>
</template>

<script lang="ts" setup generic="T extends object">
import { computed } from 'vue'

import { ValueTypeMap } from '../common'

import type { InternalProFormColumnOptions, ProFormScope } from './interface'
import type { NamePath } from 'ant-design-vue/es/form/interface'

const props = defineProps<{
  formItemName?: NamePath
  column: InternalProFormColumnOptions<T>
  values: any
  scope?: ProFormScope<T>
}>()

defineOptions({ name: 'DynamicVModel' })

const vModelName = computed(
  () => ValueTypeMap.value[props.column.type!].form!.vModelName ?? 'value'
)

function getVModel() {
  return vModel
}

const vModel = computed({
  get() {
    return props.formItemName
      ? props.scope?.getFieldValue(props.formItemName)
      : undefined
  },
  set(newValue) {
    if (props.formItemName) {
      props.scope?.setFieldValue(props.formItemName, newValue)
    }
  },
})
</script>

<style scoped>
.dynamic-v-model {
  width: 100%;
}

.dynamic-v-model.fill :deep(.ant-input),
.dynamic-v-model.fill :deep(.ant-select),
.dynamic-v-model.fill :deep(.ant-input-number),
.dynamic-v-model.fill :deep(.ant-picker) {
  width: 100%;
  box-sizing: border-box;
}
</style>
