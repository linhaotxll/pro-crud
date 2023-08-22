import { merge } from 'lodash-es'
import { computed, markRaw, reactive, ref } from 'vue'

import {
  DefaultColumnType,
  DefaultTableCellRenderMap,
  DefaultTableColumnShow,
  injectValueTypeTableCell,
} from './constant'

import { unRef, useDict } from '../common'

import type {
  InternalProTableColumnProps,
  InternalTableSlots,
  ProTableColumnProps,
  ProTableScope,
  TableSlots,
} from './interface'
import type { ColumnType, ValueType } from '../common'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { Ref } from 'vue'

export function useColumns<T extends object>(
  scope: ProTableScope<T>,
  tableColumns: ProTableColumnProps<T>[],
  tableSlots: TableSlots<T> | undefined,
  getRowKey: (record: T) => Key
) {
  // 解析后的 slots
  const resolvedTableSlots: InternalTableSlots<T> = { ...tableSlots }

  injectHeaderCell()
  injectBodyCell()

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
          hasResizeColumn
            ? (reactive(result.columnProps) as ColumnType<T>)
            : result.columnProps
        )
      }
    }

    return resolvedColumns
  })

  /**
   * 注入 header cell 插槽
   * @param column
   */
  function injectHeaderCell() {
    if (!resolvedTableSlots.headerCell) {
      resolvedTableSlots.headerCell = ctx => {
        const __column = ctx.column.__column
        const $default = ctx.title
        const resolvedKey = unRef(ctx.column.key || ctx.column.dataIndex)
        if (
          ctx.column.key === resolvedKey ||
          ctx.column.dataIndex === resolvedKey
        ) {
          return __column!.columnSlots?.headerCell?.(ctx) ?? $default
        }
        return $default
      }
    }
  }

  /**
   * 注入 body cell 插槽
   * @param column
   */
  function injectBodyCell() {
    if (!resolvedTableSlots.bodyCell) {
      resolvedTableSlots.bodyCell = ctx => {
        const __column = ctx.column.__column
        const resolvedKey = unRef(ctx.column.key || ctx.column.dataIndex)
        const $default = ctx.text

        ctx.editable = scope.validateEditable(getRowKey(ctx.record)) ?? false

        if (
          ctx.column.key === resolvedKey ||
          ctx.column.dataIndex === resolvedKey ||
          __column!.renderCell
        ) {
          return __column!.columnSlots?.bodyCell?.(ctx) ?? $default
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

    const resolvedType: ValueType = unRef(column.type ?? DefaultColumnType)

    // 解析好的列配置
    const result: InternalProTableColumnProps<T> = {
      name,
      type: resolvedType,
      dict: useDict(column.dict),
      editable: column.editable,
      renderCell: column.renderCell,
      columnProps: {
        title: unRef(column.label),
        dataIndex: name,
        __column: null!,
      },
      columnSlots: merge(
        {
          bodyCell:
            DefaultTableCellRenderMap[resolvedType] ??
            injectValueTypeTableCell(resolvedType),
        },
        column.columnSlots
      ),
    }

    //
    result.columnProps.__column = markRaw(result)

    // 遍历 columnProps，每个值都可能为响应式对象，确保能追踪到变化
    const p = unRef(column.columnProps)
    if (p) {
      Object.keys(p).forEach(key => {
        // @ts-ignore
        result.columnProps[key] = unRef(p[key])
      })
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

  return {
    columns,
    onResizeColumn,
    tableSlots: resolvedTableSlots,
  }
}
