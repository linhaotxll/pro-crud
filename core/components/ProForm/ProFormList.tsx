import { cloneDeep } from 'lodash-es'
import { defineComponent, toValue } from 'vue'

import { ProFormItem } from './ProFormItem'

import type { InternalProFormColumnOptions, ProFormScope } from './interface'
import type { PropType } from 'vue'

export const ProFormList = defineComponent({
  name: 'ProFormList',

  inheritAttrs: false,

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
          <s-space {...listValue.space}>
            {children.map(child => (
              <ProFormItem column={child} scope={props.scope} index={i} />
            ))}

            {/* 复制按钮 */}
            {copyButtonProps !== false ? (
              <a-button {...copyButtonProps} onClick={() => handleCopyLine(i)}>
                {copyButtonProps?.copyButtonText}
              </a-button>
            ) : null}

            {/* 删除按钮 */}
            {deleteButtonProps !== false ? (
              <a-button
                {...deleteButtonProps}
                onClick={() => handleDeleteLine(i)}
              >
                {deleteButtonProps?.deleteButtonText}
              </a-button>
            ) : null}
          </s-space>
        )
      })

      // 新增按钮
      const $create =
        creatorButtonProps !== false ? (
          <a-button
            {...creatorButtonProps}
            onClick={() => handleCreateNewLine()}
          >
            {creatorButtonProps?.creatorButtonText}
          </a-button>
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
