import { DCaret, Refresh } from '@element-plus/icons-vue'
import { ElButton } from 'element-plus'
import { merge } from 'lodash-es'
import { computed, ref } from 'vue'

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
  const tableSize = ref(tableProps?.size ?? DefaultTableSize)

  // 默认 toolbar
  const defaultToolbar: ProTableToolbarOption = {
    show: true,
    list: {
      reload: {
        tooltip: { content: '刷新' },
        props: {
          icon: Refresh,
          onClick: () => {
            scope.reload()
          },
        },
      },

      density: {
        tooltip: { content: '密度' },
        render: props => (
          <DropdownSelect
            trigger="click"
            v-model={tableSize.value}
            options={[
              { label: '默认', command: ToolbarDensityEnum.Large },
              { label: '中等', command: ToolbarDensityEnum.Default },
              { label: '紧凑', command: ToolbarDensityEnum.Small },
            ]}
          >
            {{
              default: () => (
                <ElButton type="primary" circle icon={DCaret} {...props} />
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

      // settings: {
      //   tooltip: { content: '列设置' },
      //   render: props => (
      //     <ToolbarSettings
      //       columns={columns}
      //       // @ts-ignore
      //       onVisible={(prop: string, visible: boolean) => {
      //         scope.changeColumnVisible(prop, visible)
      //       }}
      //       onSort={(fromIndex: number, toIndex: number) => {
      //         scope.changeColumnSort(fromIndex, toIndex)
      //       }}
      //       onFixed={(prop: string, fixed?: string | boolean) => {
      //         //
      //         scope._setPropFixed(prop, fixed)
      //       }}
      //     >
      //       {{
      //         reference: () => (
      //           <ElButton type="primary" circle icon="Tools" {...props} />
      //         ),
      //       }}
      //     </ToolbarSettings>
      //   ),
      // },
    },
  }

  // 解析 toolbar
  const resolvedToolbar = computed<InternalProTableToolbarOption>(() => {
    const toolbar = merge({}, defaultToolbar, unRef(originToolbar))
    const toolbarShow = unRef(toolbar.show!)
    const space = unRef(toolbar.space)

    // debugger
    const list = Object.keys(toolbar.list ?? {})
      .map(key => {
        const show = unRef(
          toolbar.list![key]!.tooltip?.show ??
            DefaultToolbarTooltip.tooltip!.show!
        )
        return merge({}, DefaultToolbarTooltip, toolbar.list![key]!, {
          tooltip: { show },
        })
      })
      .sort((a, b) => (unRef(a.order) ?? 1) - (unRef(b.order) ?? 1))

    return {
      show: toolbarShow,
      list,
      space: merge({}, DefaultToolbarSpace, space),
    }
  })

  return { toolbar: resolvedToolbar, tableSize }
}
