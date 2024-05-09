import { merge } from 'lodash-es'
import { type WritableComputedRef } from 'vue'

import { ensureGlobalOptions } from '~/constant'

import type { InternalProFormColumnOptions } from '../ProForm'
import type { BodyCellSlotParams } from '../ProTable'
import type { VNode } from 'vue'

export type ValueType =
  | 'text'
  | 'password'
  | 'textarea'
  | 'digit'
  | 'slider'
  | 'switch'
  | 'date'
  | 'date-week'
  | 'date-month'
  | 'date-quarter'
  | 'date-year'
  | 'date-range'
  | 'date-month-range'
  | 'date-time'
  | 'date-time-range'
  | 'time'
  | 'time-range'
  | 'auto-complete'
  | 'cascader'
  | 'dict'
  | 'dict-select'
  | 'list'

export interface ValueTypeValue<T = any, R = any> {
  form?: ValueTypeForm<T>

  table?: ValueTypeTable<R>
}

export interface ValueTypeForm<T> {
  is?: any

  /**
   * @default 'value'
   */
  vModelName?: string

  props?: any

  render?: (ctx: {
    vModel: WritableComputedRef<T>
    column: InternalProFormColumnOptions<any>
  }) => VNode
}

export interface ValueTypeTable<T> {
  is?: any
  props?: any
  render?: (ctx: BodyCellSlotParams<T>) => VNode
}

const DefaultValueType: Record<ValueType, ValueTypeValue> = {
  text: {
    form: { is: 'a-input' },
  },

  password: {
    form: { is: 'a-input-password' },
  },

  textarea: {
    form: { is: 'a-textarea' },
  },

  digit: {
    form: { is: 'a-input-number' },
  },

  slider: {
    form: { is: 'a-slider' },
  },

  switch: {
    form: { is: 'a-switch', vModelName: 'checked' },
  },

  date: {
    form: {
      is: 'a-date-picker',
      props: { placeholder: '请选择日期', valueFormat: 'YYYY-MM-DD' },
    },
  },

  'date-week': {
    form: {
      is: 'a-date-picker',
      props: {
        placeholder: '请选择周',
        picker: 'week',
        format: '第ww周',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },

  'date-month': {
    form: {
      is: 'a-date-picker',
      props: {
        placeholder: '请选择月',
        picker: 'month',
        format: 'YYYY-MM',
        valueFormat: 'YYYY-MM',
      },
    },
  },

  'date-quarter': {
    form: {
      is: 'a-date-picker',
      props: {
        placeholder: '请选择季度',
        picker: 'quarter',
        format: 'YYYY-MM',
        valueFormat: 'YYYY-MM',
      },
    },
  },

  'date-year': {
    form: {
      is: 'a-date-picker',
      props: {
        placeholder: '请选择年',
        picker: 'year',
        format: 'YYYY',
        valueFormat: 'YYYY',
      },
    },
  },

  'date-range': {
    form: {
      is: 'a-range-picker',
      props: {
        placeholder: ['请选择开始日期', '请选择结束日期'],
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },

  'date-month-range': {
    form: {
      is: 'a-range-picker',
      props: {
        placeholder: ['请选择开始月份', '请选择结束月份'],
        picker: 'month',
        format: 'YYYY-MM',
        valueFormat: 'YYYY-MM',
      },
    },
  },

  'date-time': {
    form: {
      is: 'a-date-picker',
      props: {
        showTime: true,
        placeholder: '请选择日期',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  },

  'date-time-range': {
    form: {
      is: 'a-range-picker',
      props: {
        showTime: true,
        placeholder: ['请选择开始日期', '请选择结束日期'],
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        // defaultTime: [
        //   new Date(2000, 1, 1, 0, 0, 0),
        //   new Date(2000, 1, 1, 23, 59, 59),
        // ],
      },
    },
  },

  time: {
    form: {
      is: 'a-time-picker',
      props: {
        placeholder: '请选择时间',
        format: 'HH:mm:ss',
        valueFormat: 'HH:mm:ss',
      },
    },
  },

  'time-range': {
    form: {
      is: 'a-time-range-picker',
      props: {
        placeholder: ['请选择开始时间', '请选择结束时间'],
        format: 'HH:mm:ss',
        valueFormat: 'HH:mm:ss',
      },
    },
  },

  'auto-complete': {
    form: { is: 'a-auto-complete' },
  },

  cascader: {
    form: { is: 'a-cascader' },
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

  list: {
    form: { is: 'pro-form-list' },
  },
}

let _ValueTypeMap: Record<ValueType | any, ValueTypeValue> | undefined
export const ValueTypeMap = {
  get value() {
    if (_ValueTypeMap) {
      return _ValueTypeMap
    }

    const injectType = ensureGlobalOptions().types
    return (_ValueTypeMap = merge({}, DefaultValueType, injectType) as Record<
      ValueType | any,
      ValueTypeValue
    >)
  },
}
