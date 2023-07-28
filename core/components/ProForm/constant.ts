import type { ProFormScope, ValueType } from './interface'
import type { FormItemInstance, FormItemProp } from 'element-plus'
import type { InjectionKey, Ref } from 'vue'

// 默认显示按钮组按钮
export const ShowButton = true

// 默认表单类型为 text
export const DefaultFormFieldType: ValueType = 'text'

// 删除表单是否保留字段
export const DefaultPreserve = true

// 注入 ProForm values 的 key
export const ProFormValueKey = Symbol() as InjectionKey<any>

// 注入 ProForm Scope 的 key
export const ProFormScopeKey = Symbol() as InjectionKey<ProFormScope<any>>

// 注入 FormItemRefs 的 key
export const FormItemRefKey = Symbol() as InjectionKey<
  Map<FormItemProp, Ref<FormItemInstance | null>>
>
