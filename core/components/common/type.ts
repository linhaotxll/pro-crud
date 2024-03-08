import { merge } from 'lodash-es'
import { inject, type WritableComputedRef } from 'vue'

import { GlobalOption } from '~/constant'

import type { InternalProFormColumnOptions } from '../ProForm'
import type { BodyCellSlotParams } from '../ProTable'
import type { VNode, VNodeChild } from 'vue'

/**
 * 字段类型
 */
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

/**
 * 自定义字段配置
 */
export interface ValueTypeValue<T = any, R = any> {
  /**
   * 自定义表单字段配置
   */
  form?: ValueTypeForm<T>

  /**
   * 自定义表格字段配置
   */
  table?: ValueTypeTable<R>
}

/**
 * 自定义表单配置
 */
export interface ValueTypeForm<T = any> {
  /**
   * 组件名
   */
  is?: any

  /**
   * v-model 名称
   *
   * @default 'value'
   */
  vModelName?: string

  /**
   * 传递给组件的参数
   */
  props?: any

  /**
   * 自定义渲染函数
   */
  render?: (ctx: ValueTypeFormRender<T>) => VNodeChild
}

/**
 * 自定义表单渲染函数参数
 */
export type ValueTypeFormRender<T = any> = {
  vModel: WritableComputedRef<T>
  column: InternalProFormColumnOptions<any>
}

export interface ValueTypeTable<T> {
  is?: any
  props?: any
  render?: (ctx: BodyCellSlotParams<T>) => VNode
}

export const DefaultValueType: Record<ValueType, ValueTypeValue> = {
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
    form: { is: 'a-select' },
  },

  list: {
    form: { is: 'pro-form-list' },
  },
}

export function ensureValueType() {
  return inject(GlobalOption)?.types ?? merge({}, DefaultValueType)
}
