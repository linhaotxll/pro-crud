import { merge } from 'lodash-es'
import { computed, toValue, type MaybeRef } from 'vue'

import { DefaultProProColumn } from './constant'

import { ValueTypeMap, unRef } from '../common'

import type {
  InternalProFormColumnOptions,
  ProFormColumnOptions,
} from './interface'
import type { ValueType, processDictionary } from '../common'
import type { ColProps, FormItemProps } from 'ant-design-vue'

export function buildFormColumn<T extends object>(
  col: MaybeRef<ColProps> | undefined,
  resolvedColumnsMap:
    | Map<FormItemProps['name'], InternalProFormColumnOptions<T>>
    | undefined,
  column: ProFormColumnOptions<T>,
  resolveDict?: ReturnType<typeof processDictionary>
) {
  // 合并默认 Column 配置
  const mergeColumn: ProFormColumnOptions<T> = merge(
    { col: { ...unRef(col) }, ...DefaultProProColumn },
    column
  )

  // 解析 type 类型
  const resolvedType: ValueType = unRef(mergeColumn.type)

  // const name = appendFormItemNames(
  //   toValue(parentColumn?.itemProps?.name),
  //   toValue(mergeColumn.name)
  // )
  const name = toValue(mergeColumn.name)

  // @ts-ignore
  const resolvedColumn: InternalProFormColumnOptions<T> = {
    type: resolvedType,
    resolvedKey: Array.isArray(name) ? name.join('.') : name,
    resolvedProps: merge(
      {},
      ValueTypeMap.value[resolvedType].form?.props,
      mergeColumn.fieldProps
    ),
    itemProps: { name },
  }

  type Keys = keyof typeof mergeColumn
  ;(Object.keys(mergeColumn) as Keys[]).forEach(key => {
    switch (key) {
      // case 'dict':
      //   resolvedColumn.dict = mergeColumn.dict
      //   // resolvedColumn.dict = dict || createColumnDict?.(mergeColumn.dict)
      //   break

      case 'tooltip':
        resolvedColumn.tooltip =
          typeof mergeColumn.tooltip === 'string'
            ? { title: mergeColumn.tooltip }
            : mergeColumn.tooltip
        break

      case 'fieldProps':
      case 'itemProps':
        Object.keys(mergeColumn[key]).forEach(k => {
          ;(resolvedColumn[key] ||= {})[k] = unRef(mergeColumn[key][k])
        })
        break

      default:
        resolvedColumn[key] = unRef(mergeColumn[key])
    }
  })

  resolvedColumn.dict = resolveDict?.(column)

  if (resolvedColumnsMap) {
    resolvedColumnsMap.set(name, resolvedColumn)
  }

  if (column.children && column.children.length) {
    resolvedColumn.children = column.children.map(child =>
      computed(() =>
        buildFormColumn({}, resolvedColumnsMap, child, resolveDict)
      )
    )
  }

  return resolvedColumn
}

// function appendFormItemNames(
//   parentName?: FormItemProps['name'],
//   name?: FormItemProps['name']
// ) {
//   return [...appendFormItemName(parentName), ...appendFormItemName(name)]
// }

// function appendFormItemName(name?: FormItemProps['name']) {
//   return Array.isArray(name) ? [...name] : name ? [name] : []
// }
