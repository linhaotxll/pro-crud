import { merge } from 'lodash-es'
import { inject, type WritableComputedRef } from 'vue'

import { GlobalOption } from '~/constant'

import type { InternalProFormColumnOptions } from '../ProForm'
import type {
  InternalProTableColumnProps,
  TableDefaultSlotParams,
} from '../ProTable'

export type ValueType =
  | 'text'
  | 'auto-complete'
  | 'cascader'
  | 'dict'
  | 'dict-select'

export interface ValueTypeValue<T = any, R = any> {
  form?: ValueTypeForm<T>

  table?: ValueTypeTable<R>
}

export interface ValueTypeForm<T> {
  is?: any

  props?: any

  render?: (ctx: {
    vModel: WritableComputedRef<T>
    column: InternalProFormColumnOptions<any>
  }) => JSX.Element
}

export interface ValueTypeTable<T> {
  is?: any

  props?: any

  render?: (ctx: ValueTypeTableRenderParams<T>) => JSX.Element
}

export interface ValueTypeTableRenderParams<T>
  extends TableDefaultSlotParams<T> {
  text: any
  internalColumn: InternalProTableColumnProps<T>
}

const DefaultValueType: Record<ValueType, ValueTypeValue> = {
  text: {
    form: { is: 'el-input' },
  },

  'auto-complete': {
    form: { is: 'el-autocomplete' },
  },

  cascader: {
    form: { is: 'el-cascader' },
  },

  dict: {
    table: {
      is: 'pro-dictionary',
    },
  },

  'dict-select': {
    table: { is: 'pro-dictionary' },
    form: { is: 'pro-select' },
  },
}

let _ValueTypeMap: Record<ValueType | any, ValueTypeValue> | undefined
export const ValueTypeMap = {
  get value() {
    if (_ValueTypeMap) {
      return _ValueTypeMap
    }
    const injectType = inject(GlobalOption)?.types
    return (_ValueTypeMap = merge(DefaultValueType, injectType) as Record<
      ValueType | any,
      ValueTypeValue
    >)
  },
}
