import { Tag } from 'ant-design-vue'
import { h, resolveComponent, toValue } from 'vue'

import type { DataObject } from './interface'
import type { CustomRender } from '../CustomRender'
import type { InternalProFormColumnOptions, ProFormScope } from '../ProForm'
import type { RenderBodyCellTextParams } from '../ProTable'
import type { CSSProperties, Slots, VNodeChild } from 'vue'

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
  | 'select'
  | 'radio-group'
  | 'checkbox-group'
  | 'list'

/**
 * 自定义字段配置
 */
export interface ValueTypeValue<R extends DataObject = DataObject> {
  /**
   * 自定义表单字段配置
   */
  form?: ValueTypeForm

  /**
   * 自定义表格字段配置
   */
  table?: CustomRender<R>
}

/**
 * 自定义表单配置
 */
export interface ValueTypeForm extends CustomRender {
  /**
   * v-model 名称
   *
   * @default 'value'
   */
  vModelName?: string
}

/**
 * 自定义表单组件 Props
 */
export interface ValueTypeFormProps {
  column: InternalProFormColumnOptions<any>
  style: CSSProperties | undefined
  scope: ProFormScope<any> | undefined
  slots: Slots | undefined
  // v-model:value
  [name: string]: any
}

export interface ValueTypeTable<T extends DataObject = DataObject> {
  /**
   * 组件名
   */
  is?: any

  /**
   * 传递给组件的参数
   */
  props?: any

  /**
   * 自定义渲染组件函数
   */
  render?: (ctx: RenderBodyCellTextParams<T>) => VNodeChild
}

export const DefaultValueType = {
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

  // dict: {
  //   table: {
  //     // is: 'pro-dictionary',
  //   },
  // },

  select: {
    table: {
      render: renderDictionaryInTable,
    },
    form: {
      render: renderDictionaryInForm,
    },
  },

  'radio-group': {
    table: {
      render: renderDictionaryInTable,
    },
    form: { render: renderDictionaryInForm },
  },

  'checkbox-group': {
    table: {
      render: renderDictionaryInTable,
    },
    form: { render: renderDictionaryInForm },
  },

  list: {
    form: { is: 'pro-form-list' },
  },
} as const

/**
 * 渲染字典数据在 Table 中的内容
 */
function renderDictionaryInTable(ctx: RenderBodyCellTextParams<object>) {
  const {
    text,
    column: {
      _column: { dictionary },
    },
  } = ctx
  const { label = '', color } = dictionary?.dictionaryMap.value?.[text] || {}
  return h(Tag, { color }, () => label)
}

/**
 * 渲染字典数据在 Form 中的内容
 */
function renderDictionaryInForm(ctx: ValueTypeFormProps) {
  const {
    column: { type, dictionary: { dictionary, loading } = {} },
  } = ctx

  return h(
    resolveComponent(`a-${type}`),
    {
      ...ctx,
      options: toValue(dictionary),
      loading: toValue(loading),
    },
    ctx.slots
  )
}
