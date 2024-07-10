import { toValue, type ComputedRef, type VNodeChild } from 'vue'

import { getRowKey, TableEditableNamePlaceholder } from './constant'

import { ensureValueType, mergeWithTovalue, type DataObject } from '../common'
import { ProFormItem } from '../ProForm'

import { isArray, isBoolean, isFunction } from '~/utils'

import type {
  RenderBodyCellTextParams,
  RenderCustomFilterDropdown,
  RenderCustomFilterIconParams,
  RenderHeaderCellTextParams,
} from './interface'
import type {
  InternalEditableKeys,
  InternalProTableEditableOptions,
} from './internal'
import type { TableProps } from 'ant-design-vue'

/**
 * Table bodyCell 插槽
 * @param ctx
 * @returns
 */
export function renderBodyCellText(
  ctx: RenderBodyCellTextParams<any>,
  editableKeysMap: InternalEditableKeys,
  resolvedEditable: ComputedRef<InternalProTableEditableOptions<any>>,
  tableProps: ComputedRef<TableProps>
) {
  const {
    text,
    column: {
      _column: { renderCell, type, editable, name, columnIndex },
    },
  } = ctx

  // 如果列配置存在 renderCell 则优先使用其渲染
  if (isFunction(renderCell)) {
    return renderCell(ctx)
  }

  // 检查是否处于编辑模式
  const editableValue = toValue(resolvedEditable)
  if (editableValue !== false) {
    // 监测当前列是否可编辑
    const enableEditable = isBoolean(editable)
      ? editable
      : isFunction(editable)
      ? editable(ctx)
      : false

    if (enableEditable && name) {
      const rowKey = getRowKey(ctx.record, tableProps)

      let editable = false
      const keys = editableKeysMap.get(rowKey)
      if (keys) {
        if (keys === true) {
          editable = true
        } else {
          editable = keys.includes(name)
        }
      }

      if (editable) {
        const columnOptions = toValue(
          toValue(toValue(editableValue.editFormBinding.columns))[columnIndex]
        )
        let name = columnOptions.name
        if (isArray(name)) {
          const index = name.indexOf(TableEditableNamePlaceholder)
          if (index > -1) {
            name = name.slice()
            name.splice(index, 1, rowKey)
          }
        }

        // name 应该由 rowIndex 拼接形成
        return (
          <ProFormItem
            column={mergeWithTovalue(
              { name },
              editableValue.editFormBinding.columns.value[columnIndex]
            )}
            scope={editableValue.formScope}
          />
        )
      }
      // }
    }
  }

  // 再根据 type 查询 table 的渲染方式
  if (type) {
    const tableConfig = ensureValueType()[type].table
    if (tableConfig) {
      const CellComponent = tableConfig.is
      if (CellComponent) {
        return <CellComponent {...tableConfig.props} />
      }
      if (isFunction(tableConfig.render)) {
        return tableConfig.render(ctx)
      }
    }
  }

  // 默认渲染 text
  return text
}

/**
 * Table headerCell 插槽
 * @param ctx
 * @returns
 */
export function renderHeaderCellText(ctx: RenderHeaderCellTextParams<object>) {
  const {
    title,
    column: {
      _column: { renderHeader },
    },
  } = ctx

  // 如果列配置存在 renderHeader 则优先使用其渲染
  if (isFunction(renderHeader)) {
    return renderHeader(ctx)
  }

  // 默认渲染 title
  return title
}

export function createCustomFilterIcon<Data extends DataObject = DataObject>(
  renderCustomFilterIcon: (
    ctx: RenderCustomFilterIconParams<Data>
  ) => VNodeChild
) {
  return function (ctx: RenderCustomFilterIconParams<Data>) {
    const { renderFilterIcon } = ctx.column._column

    return renderFilterIcon?.(ctx) ?? renderCustomFilterIcon(ctx)
  }
}

export function createCustomFilterDropdown<
  Data extends DataObject = DataObject
>(
  renderCustomFilterDropdown: (
    ctx: RenderCustomFilterDropdown<Data>
  ) => VNodeChild
) {
  return function (ctx: RenderCustomFilterDropdown<Data>) {
    const { renderFilterDropdown } = ctx.column._column

    return renderFilterDropdown?.(ctx) ?? renderCustomFilterDropdown(ctx)
  }
}
