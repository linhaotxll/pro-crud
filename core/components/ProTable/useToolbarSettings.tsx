import { Sort } from '@element-plus/icons-vue'
import { ElTree, ElIcon, ElSpace, ElTooltip } from 'element-plus'
import { ref } from 'vue'

import FixedLeft from '../../assets/icons/fixed-left.svg'
import FixedNormal from '../../assets/icons/fixed-normal.svg'
import FixedRight from '../../assets/icons/fixed-right.svg'

import type { InternalProTableColumnProps } from './interface'

interface UseToolbarSettingsOptions {
  options: InternalProTableColumnProps<object>[]
  visibleMap: Record<string, boolean>
  title: string
  position: WeakMap<
    InternalProTableColumnProps<object>[],
    Record<string, number>
  >
  fixed?: 'left' | 'right'
  onVisible(prop: string, visible: boolean): void
  onSort(fromIdex: number, toIndex: number): void
  onChange(checkedKeys: string[]): void

  buttons: {
    content: string
    icon: string
    onFixed(node: InternalProTableColumnProps<object>): void
  }[]
}

const iconMap = {
  FixedLeft: <FixedLeft />,
  FixedRight: <FixedRight />,
  FixedNormal: <FixedNormal />,
}

const defaultProps = { label: 'label', children: 'children' }

export function useToolbarSettings({
  options,
  visibleMap,
  title,
  buttons,
  onVisible,
  onSort,
  onChange,
}: UseToolbarSettingsOptions) {
  // ElTree 实例
  const treeRef = ref<any>(null)

  /**
   * 检测是否可以拖拽
   */
  function handleAllowDrop(_: unknown, __: undefined, type: string) {
    return type === 'inner' ? false : true
  }

  /**
   * 鼠标划入每个树节点（包括子节点）
   */
  function handleMouseEnter(
    e: MouseEvent,
    node: InternalProTableColumnProps<object>
  ) {
    e.stopPropagation()
    visibleMap[node.columnProps.prop!] = true
  }

  /**
   * 鼠标划出每个树节点（不包括子节点）
   */
  function handleMouseLeave(
    e: MouseEvent,
    node: InternalProTableColumnProps<object>
  ) {
    e.stopPropagation()
    visibleMap[node.columnProps.prop!] = false
  }

  /**
   * 将树节点移动到指定列表中
   */
  function handleMoveToFixed(
    e: MouseEvent,
    node: InternalProTableColumnProps<object>,
    onFixed: (node: InternalProTableColumnProps<object>) => void
  ) {
    e.stopPropagation()

    onFixed(node)
    // onMove(node, from, to)
    // const index = from.findIndex(
    //   item => item.columnProps.prop! === node.columnProps.prop!
    // )
    // if (index !== -1) {
    //   const fromPositionMap = position.get(from) || {}
    //   fromPositionMap[node.columnProps.prop!] = index
    //   position.set(from, fromPositionMap)
    //   from.splice(index, 1)

    //   const toPositionMap = position.get(to)
    //   if (!toPositionMap || toPositionMap[node.columnProps.prop!] == null) {
    //     to.push(node)
    //   } else {
    //     to.splice(toPositionMap[node.columnProps.prop!], 0, node)
    //   }

    //   onFixed(node.columnProps.prop!, fixed)
    // }
  }

  /**
   * 拖拽结束事件，通知外部: fromIndex -> toIndex
   */
  let fromIndex: number | undefined
  function handleNodeDropComplete(fromNode: any) {
    const toIndex = options.findIndex(
      item => item.columnProps.prop === fromNode.data.prop
    )

    if (fromIndex != null && fromIndex !== -1 && toIndex !== -1) {
      onSort(fromIndex, toIndex)
    }
  }

  /**
   * 拖拽开始事件，记录 fromIndex
   */
  function handleNodeDragStart(fromNode: any) {
    fromIndex = options.findIndex(
      item => item.columnProps.prop === fromNode.data.prop
    )
  }

  /**
   * 勾选单个树节点事件，通知外部修改隐藏/显示
   */
  function handleChangeCheckChange(
    data: InternalProTableColumnProps<object>,
    checked: boolean
  ) {
    onVisible(data.columnProps.prop!, checked)
  }

  /**
   *
   */
  function handleChangeCheck(
    _: InternalProTableColumnProps<object>,
    { checkedKeys }: { checkedKeys: string[] }
  ) {
    onChange(checkedKeys)
  }

  /**
   * 渲染函数
   */
  function render() {
    if (!options.length) {
      return null
    }

    return (
      <div>
        <el-text style="padding-left: 22px;">{title}</el-text>
        <ElTree
          style="margin-top: 8px"
          ref={treeRef}
          data={options}
          props={defaultProps}
          node-key="prop"
          check-on-click-node
          show-checkbox
          draggable
          defaultCheckedKeys={options.map(item => item.columnProps.prop!)}
          allowDrop={handleAllowDrop}
          onNode-drop={handleNodeDropComplete}
          onNode-drag-start={handleNodeDragStart}
          onCheck-change={handleChangeCheckChange}
          onCheck={handleChangeCheck}
        >
          {{
            default: ({
              data,
            }: {
              data: InternalProTableColumnProps<object>
            }) => {
              return (
                <div
                  class="custom-tree-node"
                  onMouseover={e => handleMouseEnter(e, data)}
                  onMouseleave={e => handleMouseLeave(e, data)}
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
                  <span class="el-tree-node__label">
                    {data.columnProps.label}
                  </span>

                  {visibleMap[data.columnProps.prop!] ? (
                    <ElSpace>
                      {{
                        default: () =>
                          buttons.map(item => (
                            <div
                              onClick={e =>
                                handleMoveToFixed(e, data, item.onFixed)
                              }
                            >
                              <ElTooltip content={item.content} placement="top">
                                <ElIcon
                                  size={16}
                                  color="var(--el-color-primary)"
                                >
                                  {(iconMap as any)[item.icon]}
                                </ElIcon>
                              </ElTooltip>
                            </div>
                          )),
                      }}
                    </ElSpace>
                  ) : null}
                </div>
              )
            },
          }}
        </ElTree>
      </div>
    )
  }

  return { render, treeRef }
}
