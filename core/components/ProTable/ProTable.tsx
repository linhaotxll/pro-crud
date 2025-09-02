import { type TableProps } from 'ant-design-vue'
import { defineComponent, isRef, toValue, unref } from 'vue'

import { ProButtonGroup } from '../ProButton'
import { ProForm } from '../ProForm'

import { isFunction } from '~/utils'

import type { TableSlotFn, TableSlotValueKey } from './constant'
import type { BuildTableBinding, CustomRenderTableContext } from './interface'
import type { InternalProButtonGroupOptions } from '../ProButton'
import type { FlexProps } from 'ant-design-vue'
import type { ComputedRef, PropType, Ref } from 'vue'
import { buildCustomRender, CustomRender } from '../CustomRender'

export const ProTable = defineComponent({
  name: 'ProTable',

  props: {
    tableProps: Object as PropType<ComputedRef<TableProps>>,
    tableSlots: Object as PropType<
      ComputedRef<Record<TableSlotValueKey, TableSlotFn> | null>
    >,
    search: {
      type: Object as PropType<BuildTableBinding['search']>,
      required: true,
    },
    toolbar: Object as PropType<Ref<InternalProButtonGroupOptions>>,
    wrapperProps: Object as PropType<ComputedRef<FlexProps>>,
    renderWrapper: Object as PropType<BuildTableBinding['renderWrapper']>,
    editable: Object as PropType<BuildTableBinding['editable']>,
    renderTable: Object as PropType<CustomRender<CustomRenderTableContext<any>>>
  },

  setup(props) {
    return () => {

      const resolvedTableProps = toValue(props.tableProps)
      console.log('slots: ', toValue(props.tableSlots)?.bodyCell)

      const $table = buildCustomRender({
        is: props.renderTable?.is,
        render: ctx => {
          const $defaultRender = unref(props.renderTable?.render)?.(ctx)
          if ($defaultRender) {
            const paginationConfig = toValue(props.tableProps)?.pagination
            const $pagination  = paginationConfig === false
              ? null
              : (
                <div style="display: flex; justify-content: end; margin: 16px 0;">
                  <a-pagination {...paginationConfig} />
                </div>
              )
            return (
              <div>
                {$defaultRender}
                {$pagination}
              </div>
            )
          }
          return (
            <a-table {...toValue(props.tableProps)}>
              {toValue(props.tableSlots)}
            </a-table>
          )
        },
        context: {
          dataSource:  resolvedTableProps?.dataSource,
          columns: resolvedTableProps?.columns,
        }
      })

      // const $table = (
      //   <a-table {...toValue(props.tableProps)}>
      //     {toValue(props.tableSlots)}
      //   </a-table>
      // )

      const editableValue = toValue(props.editable)

      const $mergeTable =
        editableValue === false ? (
          $table
        ) : (
          <ProForm
            {...toValue(editableValue?.editFormBinding)}
            wrap={{ render: () => $table }}
          />
        )

      const resolvedToolbar = toValue(props.toolbar)

      const $toolbar = resolvedToolbar?.show ? (
        <ProButtonGroup action={resolvedToolbar} />
      ) : null

      const searchValue = toValue(props.search)

      const $search = toValue(searchValue.columns).length ? (
        <ProForm {...searchValue} />
      ) : null

      const $children = [$search, $toolbar, $mergeTable].filter(Boolean)

      if ($children.length > 1) {
        const Wrap = isRef(props.renderWrapper) ? (
          props.renderWrapper.value($children)
        ) : isFunction(props.renderWrapper) ? (
          props.renderWrapper($children)
        ) : (
          <a-flex {...toValue(props.wrapperProps)}>{$children}</a-flex>
        )

        return Wrap
      }

      return $children[0]
    }
  },
})
