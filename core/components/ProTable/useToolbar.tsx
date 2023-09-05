import { ColumnHeightOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { Button } from 'ant-design-vue'
import { merge } from 'lodash-es'
import { computed, h, ref } from 'vue'

import {
  DefaultTableSize,
  DefaultToolbarSpace,
  DefaultToolbarTooltip,
  ToolbarDensityEnum,
} from './constant'

import { unRef } from '../common'
import { DropdownSelect } from '../DropdownSelect'

import type {
  BuildProTableOptionResult,
  InternalProTableToolbarOption,
  ProTableScope,
  ProTableToolbarOption,
} from './interface'

export function useToolbar<T extends object>(
  tableProps: BuildProTableOptionResult<T, any>['tableProps'],
  originToolbar: BuildProTableOptionResult<T, any>['toolbar'],
  scope: ProTableScope<T>
) {
  // 表格大小
  const tableSize = ref(unRef(unRef(tableProps)?.size) ?? DefaultTableSize)

  // 默认 toolbar
  const defaultToolbar: ProTableToolbarOption = {
    show: true,
    actions: {
      reload: {
        tooltip: { title: '刷新' },
        props: {
          icon: h(ReloadOutlined),
          shape: 'circle',
          onClick: scope.reload,
        },
      },

      density: {
        tooltip: { title: '密度' },
        render: props => (
          <DropdownSelect
            trigger="click"
            v-model={tableSize.value}
            options={[
              { label: '默认', value: ToolbarDensityEnum.Large },
              { label: '中等', value: ToolbarDensityEnum.Default },
              { label: '紧凑', value: ToolbarDensityEnum.Small },
            ]}
          >
            {{
              default: () => (
                <Button
                  type="primary"
                  shape="circle"
                  icon={h(ColumnHeightOutlined)}
                  {...props}
                />
              ),
            }}
          </DropdownSelect>
        ),
      },

      // export: {
      //   tooltip: { content: '导出' },
      //   props: {
      //     icon: 'UploadFilled',
      //     onClick: () => {
      //       scope.reload()
      //     },
      //   },
      // },
    },
  }

  // 解析 toolbar
  const resolvedToolbar = computed<InternalProTableToolbarOption>(() => {
    const toolbar = merge({}, defaultToolbar, unRef(originToolbar))
    const toolbarShow = unRef(toolbar.show!)
    const space = unRef(toolbar.space)

    const actions = Object.keys(toolbar.actions ?? {})
      .map(key => {
        const result = merge({}, DefaultToolbarTooltip, toolbar.actions![key]!)

        result.show = unRef(result.show)
        result.tooltip!.show = unRef(result.tooltip!.show)

        return result
      })
      .sort((a, b) => (unRef(a.order) ?? 1) - (unRef(b.order) ?? 1))

    return {
      show: toolbarShow,
      actions,
      space: merge({}, DefaultToolbarSpace, space),
    }
  })

  return { toolbar: resolvedToolbar, tableSize }
}
