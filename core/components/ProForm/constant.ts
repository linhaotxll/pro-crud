import type { ProFormColumnOptions } from './interface'
import type { ColProps, FormItemInstance } from 'ant-design-vue'
import type { NamePath } from 'ant-design-vue/es/form/interface'
import type { InjectionKey, Ref } from 'vue'

// 注入 FormItemRefs 的 key
export const FormItemRefKey = Symbol() as InjectionKey<
  Map<NamePath, Ref<FormItemInstance | null>>
>

export const ProFormInstanceNames = [
  'submit',
  'reset',
  'resetFields',
  'setFieldValue',
  'setFieldValues',
  'setFieldValuesTransform',
  'getFieldValue',
  'removeFields',
  'validate',
  'validateField',
  'scrollToField',
  'clearValidate',
  'getFieldInstance',
  'getFormValues',
] as const

export const DefaultProProColumn: ProFormColumnOptions<any> = {
  show: true,
  preserve: true,
  type: 'text',
  submitted: true,
  fill: true,
}

export const DefaultProFormCol: ColProps = { span: 24 }
