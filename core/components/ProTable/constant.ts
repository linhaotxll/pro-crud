import { h, resolveComponent } from 'vue'

import { ValueTypeMap, type ElSpaceProps, type ValueType } from '../common'

import type { ProTableColumnSlots, ToolbarOption } from './interface'

export const DefaultPageNumber = 1
export const DefaultPageSize = 10

// 默认 toolbar 按钮配置
export const DefaultToolbarTooltip: ToolbarOption = {
  show: true,
  order: 1,
  tooltip: { placement: 'top', show: true },
  props: {
    type: 'primary',
    shape: 'circle',
  },
}

// toolbar 默认间距配置
export const DefaultToolbarSpace: ElSpaceProps = { size: 16 }

// toolbar 密度枚举
export const enum ToolbarDensityEnum {
  Large = 'large',
  Default = 'middle',
  Small = 'small',
}

// 表格默认大小
export const DefaultTableSize = 'large'

// 默认显示表格列
export const DefaultTableColumnShow = true

export const DefaultColumnType: ValueType = 'text'

// 不同 type 表格渲染类型
export const DefaultTableCellRenderMap: Partial<
  Record<ValueType, ProTableColumnSlots<any>['bodyCell']>
> = {
  dict: injectTableCell('dict'),
  'dict-select': injectTableCell('dict-select'),
}

function injectTableCell(
  valueType: ValueType
): ProTableColumnSlots<any>['bodyCell'] {
  return ctx => {
    const defaultTableType = ValueTypeMap.value[valueType]?.table
    if (defaultTableType) {
      const { is: Comp, props, render } = defaultTableType
      if (Comp) {
        return h(resolveComponent(Comp), { ...props, ctx })
      } else if (render) {
        return render(ctx)
      }
    }
    return null
  }
}
