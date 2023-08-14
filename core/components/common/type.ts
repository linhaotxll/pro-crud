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
  | 'digit'
  | 'slider'
  | 'switch'
  | 'date'
  | 'date-week'
  | 'date-month'
  | 'date-year'
  | 'date-dates'
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

  digit: {
    form: { is: 'el-input-number' },
  },

  slider: {
    form: { is: 'el-slider' },
  },

  switch: {
    form: { is: 'el-switch' },
  },

  date: {
    form: {
      is: 'el-date-picker',
      props: { placeholder: '请选择日期', valueFormat: 'YYYY-MM-DD' },
    },
  },

  'date-week': {
    form: {
      is: 'el-date-picker',
      props: {
        placeholder: '请选择周',
        type: 'week',
        format: '第ww周',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },

  'date-month': {
    form: {
      is: 'el-date-picker',
      props: {
        placeholder: '请选择月',
        type: 'month',
        format: 'YYYY-MM',
        valueFormat: 'YYYY-MM',
      },
    },
  },

  'date-year': {
    form: {
      is: 'el-date-picker',
      props: {
        placeholder: '请选择年',
        type: 'year',
        format: 'YYYY',
        valueFormat: 'YYYY',
      },
    },
  },

  'date-dates': {
    form: {
      is: 'el-date-picker',
      props: {
        placeholder: '请选择多个日期',
        type: 'dates',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },

  'date-range': {
    form: {
      is: 'el-date-picker',
      props: {
        startPlaceholder: '请选择开始日期',
        endPlaceholder: '请选择结束日期',
        type: 'daterange',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },

  'date-month-range': {
    form: {
      is: 'el-date-picker',
      props: {
        startPlaceholder: '请选择开始月份',
        endPlaceholder: '请选择结束月份',
        type: 'monthrange',
        format: 'YYYY-MM',
        valueFormat: 'YYYY-MM',
      },
    },
  },

  'date-time': {
    form: {
      is: 'el-date-picker',
      props: {
        placeholder: '请选择日期',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  },

  'date-time-range': {
    form: {
      is: 'el-date-picker',
      props: {
        startPlaceholder: '请选择开始日期',
        endPlaceholder: '请选择结束日期',
        type: 'datetimerange',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        defaultTime: [
          new Date(2000, 1, 1, 0, 0, 0),
          new Date(2000, 1, 1, 23, 59, 59),
        ],
      },
    },
  },

  time: {
    form: {
      is: 'el-time-picker',
      props: {
        placeholder: '请选择时间',
        arrowControl: true,
        format: 'HH:mm:ss',
        valueFormat: 'HH:mm:ss',
      },
    },
  },

  'time-range': {
    form: {
      is: 'el-time-picker',
      props: {
        startPlaceholder: '请选择开始时间',
        endPlaceholder: '请选择结束时间',
        arrowControl: true,
        isRange: true,
        format: 'HH:mm:ss',
        valueFormat: 'HH:mm:ss',
      },
    },
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
