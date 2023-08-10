export type ValueType = 'text' | 'select' | 'auto-complete' | 'cascader'

export const valueTypeMap: Record<ValueType, [string, object?]> = {
  text: ['el-input'],
  select: ['pro-select', { placeholder: '请选择' }],
  'auto-complete': ['el-autocomplete'],
  cascader: ['el-cascader'],
}
