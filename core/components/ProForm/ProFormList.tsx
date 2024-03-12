import { Button, Space } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { defineComponent, toValue } from 'vue'

import { ProFormItem } from './ProFormItem'

import type { InternalProFormColumnOptions, ProFormScope } from './interface'
import type { PropType } from 'vue'

export const ProFormList = defineComponent({
  name: 'ProFormList',

  props: {
    column: {
      type: Object as PropType<InternalProFormColumnOptions<any>>,
      required: true,
    },
    scope: Object as PropType<ProFormScope<any>>,
    value: Array as PropType<object[] | undefined>,
  },

  emits: ['update:value'],

  setup(props, { emit }) {
    /**
     * 创建新行
     */
    function handleCreateNewLine(record?: any) {
      const current = props.value?.length ?? 0
      const { max = Number.MAX_VALUE, creatorRecord } =
        toValue(props.column?.list) ?? {}

      if (current >= max) {
        // showToast(`最多添加${max}条数据`, undefined, 'warning')
        return
      }

      const newRecord = record ?? creatorRecord?.() ?? {}

      emit('update:value', (props.value || []).concat(newRecord))
    }

    /**
     * 删除旧行
     */
    function handleDeleteLine(index: number) {
      if (props.value) {
        const current = props.value.length
        const { min = Number.MIN_VALUE } = toValue(props.column?.list) ?? {}

        if (current <= min) {
          // showToast(`最少保持${min}条数据`, undefined, 'warning')
          return
        }

        const deleteValue = props.value.slice()
        deleteValue.splice(index, 1)
        emit('update:value', deleteValue)
      }
    }

    /**
     * 复制一行
     */
    function handleCopyLine(index: number) {
      handleCreateNewLine(cloneDeep(props.value![index]))
    }

    return () => {
      console.log('render pro form list')
      // 没有配置 list 或 children 均不会渲染
      const listValue = toValue(props.column.list)
      if (!listValue) {
        return null
      }

      const children = toValue(listValue.children)
      if (!children || !children.length) {
        return null
      }

      const value = toValue(props.value)

      const { copyButtonProps, deleteButtonProps, creatorButtonProps } =
        listValue || {}

      // 渲染子控件
      const $children = value?.map((_, i) => {
        return (
          <Space {...listValue.space}>
            {children.map(child => (
              <ProFormItem column={child} scope={props.scope} index={i} />
            ))}

            {/* 复制按钮 */}
            {copyButtonProps !== false ? (
              <Button {...copyButtonProps} onClick={() => handleCopyLine(i)}>
                {copyButtonProps?.copyButtonText}
              </Button>
            ) : null}

            {/* 删除按钮 */}
            {deleteButtonProps !== false ? (
              <Button
                {...deleteButtonProps}
                onClick={() => handleDeleteLine(i)}
              >
                {deleteButtonProps?.deleteButtonText}
              </Button>
            ) : null}
          </Space>
        )
      })

      // 新增按钮
      const $create =
        creatorButtonProps !== false ? (
          <Button {...creatorButtonProps} onClick={() => handleCreateNewLine()}>
            {creatorButtonProps?.creatorButtonText}
          </Button>
        ) : null

      return (
        <>
          {$children}
          {$create}
        </>
      )
    }
  },
})
