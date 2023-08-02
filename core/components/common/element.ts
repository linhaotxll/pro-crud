import type { ToHandles } from './interface'
import type {
  AutocompleteProps,
  AutocompleteEmits,
  CascaderProps,
  CascaderEmits,
  InputProps,
  InputEmits,
  ColProps,
  RowProps,
  FormProps,
  FormEmits,
  FormItemProps,
} from 'element-plus'

// AutoComplete
export type ElAutoCompleteProps = Partial<
  AutocompleteProps & ToHandles<AutocompleteEmits>
>
export type ElAutoCompleteSlots = {
  default?: (ctx: { item: Record<string, any> }) => JSX.Element
  prefix?: () => JSX.Element
  suffix?: () => JSX.Element
  prepend?: () => JSX.Element
  append?: () => JSX.Element
}

// Cascader
export type ElCascaderProps = Partial<CascaderProps & ToHandles<CascaderEmits>>
// export type ElCheckboxProps = Partial<CheckboxProps & ToHandles<CheckboxEmits>>

// Input
export type ElInputProps = Partial<InputProps & ToHandles<InputEmits>>
export type ElInputSlots = {
  prefix?: () => JSX.Element
  suffix?: () => JSX.Element
  prepend?: () => JSX.Element
  append?: () => JSX.Element
}

export type ElColProps = Partial<ColProps>
export type ElRowProps = Partial<RowProps>
export type ElFormProps = Partial<FormProps & ToHandles<FormEmits>>
export type ElFormItemProps = Partial<FormItemProps>
