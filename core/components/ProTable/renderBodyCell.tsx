import { isFunction } from '~/utils'

import type {
  RenderBodyCellTextParams,
  RenderHeaderCellTextParams,
} from './interface'

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
