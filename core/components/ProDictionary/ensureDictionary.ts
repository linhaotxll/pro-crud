import type { DictionaryColumn } from './interface'
import type { ValueType } from '../common'

const enableDictionaryTypes = [
  'select',
  'radio-group',
  'checkbox-group',
] as const

export type DictionaryType = (typeof enableDictionaryTypes)[number]

export function ensureDictionary(
  type: ValueType,
  dictionaryOptions: DictionaryColumn['dict']
) {
  return enableDictionaryTypes.includes(type as any) && !!dictionaryOptions
}
