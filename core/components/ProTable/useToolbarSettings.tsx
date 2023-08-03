import {
  UploadFilled,
  Tools,
  Refresh,
  DCaret,
  Sort,
} from '@element-plus/icons-vue'
import { ElTree, ElIcon, ElSpace, ElTooltip } from 'element-plus'

import FixedLeft from '../../assets/icons/fixed-left.svg'
import FixedNormal from '../../assets/icons/fixed-normal.svg'
import FixedRight from '../../assets/icons/fixed-right.svg'

import type { ColumnSettingsNode } from './interface'
import type { CSSProperties } from 'vue'

interface UseToolbarSettingsOptions {
  options: ColumnSettingsNode[]
  visibleMap: Record<string, boolean>
  buttons: {
    content: string
    icon: string
    from: ColumnSettingsNode[]
    to: ColumnSettingsNode[]
  }[]
}

const iconMap = {
  FixedLeft: <FixedLeft />,
  FixedRight: <FixedRight />,
  FixedNormal: <FixedNormal />,
}

console.log(1, iconMap)

const defaultProps = { label: 'label', children: 'children' }

const customTreeNodeStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  justifyContent: 'space-between',
}

export function useToolbarSettings({
  options,
  // from,
  // to,
  visibleMap,
  buttons,
}: UseToolbarSettingsOptions) {
  function handleAllowDrop(_: unknown, __: undefined, type: string) {
    return type === 'inner' ? false : true
  }

  function handleMouseEnter(node: ColumnSettingsNode) {
    console.log('enter')
    visibleMap[node.prop] = true
  }

  function handleMouseLeave(node: ColumnSettingsNode) {
    visibleMap[node.prop] = false
  }

  /**
   * 移动到 fixed left 中
   */
  function handleMoveToFixed(
    node: ColumnSettingsNode,
    from: ColumnSettingsNode[],
    to: ColumnSettingsNode[]
  ) {
    const index = from.findIndex(item => item.prop === node.prop)
    if (index !== -1) {
      from.splice(index, 1)
      to.push(node)
    }
  }

  function render() {
    return (
      <ElTree
        data={options}
        props={defaultProps}
        node-key="prop"
        check-on-click-node
        show-checkbox
        draggable
        allowDrop={handleAllowDrop}
      >
        {{
          default: ({ node, data }: any) => (
            <span
              class="custom-tree-node"
              onMouseover={() => handleMouseEnter(data)}
              onMouseout={() => handleMouseLeave(data)}
            >
              <div class="custom-tree-node-place">
                <ElIcon
                  class="sort-icon"
                  size={14}
                  color="var(--el-text-color-secondary)"
                >
                  <Sort />
                </ElIcon>
              </div>

              <span class="el-tree-node__label">{node.label}</span>

              {visibleMap[data.prop] ? (
                <ElSpace>
                  {{
                    default: () =>
                      buttons.map(item => (
                        <ElTooltip content={item.content} placement="top">
                          <ElIcon
                            size={16}
                            color="var(--el-color-primary)"
                            // @ts-ignore
                            onClick={() =>
                              handleMoveToFixed(data, item.from, item.to)
                            }
                          >
                            {(iconMap as any)[item.icon]}
                          </ElIcon>
                        </ElTooltip>
                      )),
                  }}
                </ElSpace>
              ) : null}

              {/* <div v-lazy-show="visibleMap[data.prop]">
                <ElSpace>
                  {{
                    default: () =>
                      buttons.map(item => (
                        <ElTooltip content={item.content} placement="top">
                          <ElIcon
                            size={16}
                            color="var(--el-color-primary)"
                            onClick={() =>
                              handleMoveToFixed(data, item.from, item.to)
                            }
                          >
                            <component is={item.icon} />
                          </ElIcon>
                        </ElTooltip>
                      )),
                  }}

                </ElSpace>
              </div> */}
            </span>
          ),
        }}
      </ElTree>
    )
  }

  return { render }
}
