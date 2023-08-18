import { computed, reactive, ref } from 'vue'

import { DefaultColumnType, DefaultTableColumnShow } from './constant'

import { unRef, useDict } from '../common'

import type {
  InternalProTableColumnProps,
  InternalTableSlots,
  ProTableColumnProps,
  ProTableColumnSlots,
  TableSlots,
} from './interface'
import type { ColumnType } from 'ant-design-vue/es/table'
import type { DataIndex } from 'ant-design-vue/es/vc-table/interface'
import type { Ref } from 'vue'

const DefaultValueSlot: Record<
  keyof ProTableColumnSlots<any>,
  (ctx: any) => any
> = {
  headerCell: ctx => ctx.title,
  bodyCell: ctx => ctx.text,
}

export function useColumns<T extends object>(
  tableColumns: ProTableColumnProps<T>[],
  tableSlots?: TableSlots<T>
) {
  const resolvedTableSlots: InternalTableSlots<T> = { ...tableSlots }
  const resolvedShow = reactive<Map<DataIndex, boolean>>(new Map())
  const onResizeColumn: Ref<
    ((w: number, column: ColumnType<T>) => void) | undefined
  > = ref()

  const columns = computed(() => {
    const resolvedColumns: ColumnType<T>[] = []
    for (const column of tableColumns) {
      const result = resolveColumn(column)
      if (result) {
        resolvedColumns.push(result.columnProps)
      }
    }

    return resolvedColumns
  })

  function injectTableSlot(
    type: keyof ProTableColumnSlots<T>,
    column: ProTableColumnProps<T>,
    defaultValue: (ctx: any) => any
  ) {
    const resolvedKey = unRef(column.key || column.name)
    if (column.columnSlots?.[type] && !resolvedTableSlots[type]) {
      resolvedTableSlots[type] = ctx => {
        const $default = <span>{defaultValue(ctx)}</span>

        if (
          ctx.column.key === resolvedKey ||
          ctx.column.dataIndex === resolvedKey
        ) {
          return column.columnSlots?.[type]?.(ctx as any) ?? $default
        }
        return $default
      }
    }
  }

  function resolveColumn(column: ProTableColumnProps<T>) {
    const name = unRef(column.name)
    const show = name
      ? resolvedShow.get(name) ?? DefaultTableColumnShow
      : DefaultTableColumnShow

    if (!show) {
      return
    }

    const result: InternalProTableColumnProps<T> = {
      type: unRef(column.type ?? DefaultColumnType),
      dict: useDict(column.dict),
      columnProps: {
        title: unRef(column.label),
        dataIndex: name,
      },
    }

    const p = unRef(column.columnProps)
    if (p) {
      Object.keys(p).forEach(key => {
        // @ts-ignore
        result.columnProps[key] = unRef(p[key])
      })
    }

    if (column.columnSlots) {
      ;(
        Object.keys(column.columnSlots) as (keyof ProTableColumnSlots<T>)[]
      ).forEach(type => injectTableSlot(type, column, DefaultValueSlot[type]))
    }

    if (column.children) {
      const resolvedChildren = Array.isArray(column.children)
        ? column.children
        : [column.children]

      for (const c of resolvedChildren) {
        const resolvedChild = resolveColumn(c)
        if (resolvedChild) {
          // @ts-ignore
          ;(result.columnProps.children ||= []).push(resolvedChild.columnProps)
        }
      }
    }

    // console.log(name, result.columnProps.resizable)
    if (result.columnProps.resizable && !onResizeColumn.value) {
      onResizeColumn.value = (w, c) => {
        console.log(c)
        c.width = w
      }
    }

    return result
  }

  return { columns, onResizeColumn, tableSlots: resolvedTableSlots }
}
