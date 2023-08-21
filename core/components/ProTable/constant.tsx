import { h, inject, resolveComponent } from 'vue'

import { ValueTypeMap, type ValueType } from '../common'
import { ProFormItem } from '../ProForm'

import type {
  ProTableColumnSlots,
  ProvideEditTableOptions,
  ToolbarOption,
} from './interface'
import type { FormItemProps, SpaceProps } from 'ant-design-vue'
import type { InjectionKey } from 'vue'

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
export const DefaultToolbarSpace: SpaceProps = { size: 16 }

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
  dict: injectValueTypeTableCell('dict'),
  'dict-select': injectValueTypeTableCell('dict-select'),
}

export const EditableTableData = Symbol() as InjectionKey<
  ProvideEditTableOptions | undefined
>

export function injectValueTypeTableCell(
  valueType: ValueType
): ProTableColumnSlots<any>['bodyCell'] {
  return ctx => {
    const editableData = inject(EditableTableData)
    console.log('editableData: ', editableData?.editRowKeys.value)

    // debugger
    // ctx.column.row
    if (editableData) {
      const { name } = ctx.column.__column!
      console.log(123, name, editableData.editRowKeys.value, ctx.record.id)

      if (name && editableData.editRowKeys.value.includes(ctx.record.id)) {
        const internalColumn =
          editableData.editFormBinding.resolvedColumnsMap.get(
            name as FormItemProps['name']
          ) ??
          editableData.editFormBinding.columns.find(c => c.value.name === name)
            ?.value

        console.log(
          666,
          internalColumn,
          editableData.editFormBinding.resolvedColumnsMap
        )
        if (internalColumn) {
          return (
            <ProFormItem
              column={internalColumn}
              scope={editableData.editFormBinding.scope}
              values={editableData.editFormBinding.values}
              formItemRefMap={editableData.editFormBinding.formItemRef}
            />
          )
        }
      }
    }

    const defaultTableType = ValueTypeMap.value[valueType]?.table
    if (defaultTableType) {
      const { is: Comp, props, render } = defaultTableType
      if (Comp) {
        return h(resolveComponent(Comp), { ...props, ctx })
      } else if (render) {
        return render(ctx)
      }
    }

    // console.log('editableData:', editableData)
    // @ts-ignore
    // if (name && _editRowKeys && _editRowKeys.value.includes(name)) {
    //   console.log(555)
    // map
    // edit column form props
    // scope
    // values

    //   console.log('column: ', column)

    //   // return h(resolveComponent('ProFormItem'), { column })
    //   // 构建 buildFormColumn
    //   // <pro-form-item
    //   //         :column="column.value"
    //   //         :scope="scope"
    //   //         :form-item-ref-map="formItemRef"
    //   //         :values="values"
    //   //       />
    // }

    return null
  }
}
