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
  // 解析后的 slots
  const resolvedTableSlots: InternalTableSlots<T> = { ...tableSlots }

  // 是否存在可伸缩的列，可伸缩的事件
  let hasResizeColumn = false
  const onResizeColumn: Ref<
    ((w: number, column: ColumnType<T>) => void) | undefined
  > = ref()

  const columns = computed(() => {
    const resolvedColumns: ColumnType<T>[] = []
    for (const column of tableColumns) {
      // debugger
      const result = resolveColumn(column)
      if (result) {
        // 如果需要伸缩，则对每个列配置进行响应式处理，确保在响应事件中修改列宽度能够改变页面
        resolvedColumns.push(
          hasResizeColumn ? reactive(result.columnProps) : result.columnProps
        )
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

  /**
   * 解析列配置
   * @param column
   * @returns
   */
  function resolveColumn(column: ProTableColumnProps<T>) {
    const name = unRef(column.name)
    const show = unRef(column.show ?? DefaultTableColumnShow)

    // 不显示的列不需要进一步解析
    if (!show) {
      return
    }

    // 解析好的列配置
    const result: InternalProTableColumnProps<T> = {
      type: unRef(column.type ?? DefaultColumnType),
      dict: useDict(column.dict),
      columnProps: {
        title: unRef(column.label),
        dataIndex: name,
      },
    }

    // 遍历 columnProps，每个值都可能为响应式对象，确保能追踪到变化
    const p = unRef(column.columnProps)
    if (p) {
      Object.keys(p).forEach(key => {
        // @ts-ignore
        result.columnProps[key] = unRef(p[key])
      })
    }

    // 注入 slots
    if (column.columnSlots) {
      ;(
        Object.keys(column.columnSlots) as (keyof ProTableColumnSlots<T>)[]
      ).forEach(type => injectTableSlot(type, column, DefaultValueSlot[type]))
    }

    // 处理子表头
    if (column.children) {
      const resolvedChildren = Array.isArray(column.children)
        ? column.children
        : [column.children]

      // 解析子列配置，加入到当前列中
      for (const c of resolvedChildren) {
        const resolvedChild = resolveColumn(c)
        if (resolvedChild) {
          // @ts-ignore
          ;(result.columnProps.children ||= []).push(resolvedChild.columnProps)
        }
      }
    }

    // 如果有一个列需要伸缩，那么就会设置伸缩事件
    if (result.columnProps.resizable && !onResizeColumn.value) {
      hasResizeColumn = true
      onResizeColumn.value = (w, c) => {
        c.width = w
      }
    }

    return result
  }

  return { columns, onResizeColumn, tableSlots: resolvedTableSlots }
}
