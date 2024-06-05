import { isFunction } from '~/utils'

import type {
  RenderBodyCellTextParams,
  RenderCustomFilterDropdown,
  RenderCustomFilterIconParams,
  RenderHeaderCellTextParams,
} from './interface'
import type { DataObject } from '../common'
import type { VNodeChild } from 'vue'

/**
 * Table bodyCell 插槽
 * @param ctx
 * @returns
 */
export function renderBodyCellText(ctx: RenderBodyCellTextParams<object>) {
  const {
    text,
    column: {
      _column: { renderCell },
    },
  } = ctx

  // 如果列配置存在 renderCell 则优先使用其渲染
  if (isFunction(renderCell)) {
    return renderCell(ctx)
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
