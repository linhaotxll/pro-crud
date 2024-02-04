<script lang="tsx">
import { Button, Col, Row, Tooltip } from 'ant-design-vue'
import { cloneDeep, merge } from 'lodash-es'
import { computed, defineComponent, toValue } from 'vue'

import {
  DefaultCopyRecordButtonProps,
  DefaultCreateRecordButtonProps,
  DefaultDeleteRecordButtonProps,
} from './constant'

import { ProFormItem } from '../ProForm'
import { showToast } from '../Toast'

import type {
  InternalProFormColumnOptions,
  ProFormScope,
  BuildFormBinding,
  ProFormListOptions,
} from '../ProForm'
import type { PropType } from 'vue'

function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default defineComponent({
  name: 'ProFormList',

  props: {
    value: { type: Array },
    column: Object as PropType<InternalProFormColumnOptions<any>>,
    scope: Object as PropType<ProFormScope<any>>,
    formItemRefMap: Object as PropType<BuildFormBinding<any>['formItemRef']>,
  },

  emits: ['update:value'],

  setup(props, { emit }) {
    /**
     * 创建新行
     */
    function handleCreateNewLine(record?: any) {
      if (!props.column?.list) {
        return
      }

      const current = props.value?.length ?? 0
      const { max = Number.MAX_VALUE, creatorRecord } = props.column.list

      if (current >= max) {
        showToast(`最多添加${max}条数据`, undefined, 'warning')
        return
      }

      const newRecord = record ?? creatorRecord?.() ?? {}

      emit('update:value', (props.value || []).concat(newRecord))
    }

    /**
     * 删除旧行
     */
    function handleDeleteLine(index: number) {
      if (!props.column?.list) {
        return
      }

      if (props.value) {
        const current = props.value.length
        const { min = Number.MIN_VALUE } = props.column.list

        if (current <= min) {
          showToast(`最少保持${min}条数据`, undefined, 'warning')
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

    // 合并添加按钮配置
    const mergedCreateReocrdButtonProps = computed<
      Required<ProFormListOptions>['creatorButtonProps']
    >(() =>
      toValue(props.column?.list?.creatorButtonProps) === false
        ? false
        : merge(
            {},
            DefaultCreateRecordButtonProps,
            toValue(props.column?.list?.creatorButtonProps)
          )
    )

    // 合并删除按钮配置
    const mergedDeleteRecordButtonProps = computed<
      Required<ProFormListOptions>['deleteButtonProps']
    >(() =>
      toValue(props.column?.list?.deleteButtonProps) === false
        ? false
        : merge(
            {},
            DefaultDeleteRecordButtonProps,
            toValue(props.column?.list?.deleteButtonProps)
          )
    )

    // 合并复制按钮配置
    const mergedCopyRecordButtonProps = computed<
      Required<ProFormListOptions>['copyButtonProps']
    >(() =>
      toValue(props.column?.list?.copyButtonProps) === false
        ? false
        : merge(
            {},
            DefaultCopyRecordButtonProps,
            toValue(props.column?.list?.copyButtonProps)
          )
    )

    return () => {
      const mergedDeleteButtonProps = mergedDeleteRecordButtonProps.value
      const mergedCreateButtonProps = mergedCreateReocrdButtonProps.value
      const mergedCopyButtonProps = mergedCopyRecordButtonProps.value

      const $child = props.value?.map((item, i) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Row key={getUuid()} style={{ flex: 1 }} gutter={8}>
            {props.column?.children?.map(child => (
              <Col {...child.value.col} key={child.value.resolvedKey}>
                <ProFormItem
                  column={child.value}
                  scope={props.scope!}
                  values={item}
                  formItemRefMap={props.formItemRefMap!}
                />
              </Col>
            ))}
          </Row>

          {mergedCopyButtonProps === false
            ? null
            : props.column?.list?.renderCopyRecordButton?.(() =>
                handleCopyLine(i)
              ) ?? (
                <Tooltip title="复制当前行">
                  <Button
                    {...mergedCopyButtonProps}
                    onClick={() => handleCopyLine(i)}
                  >
                    {mergedCopyButtonProps.copyButtonText}
                  </Button>
                </Tooltip>
              )}

          {mergedDeleteButtonProps === false
            ? null
            : props.column?.list?.renderDeleteRecordButton?.(() =>
                handleDeleteLine(i)
              ) ?? (
                <Tooltip title="删除当前行">
                  <Button
                    {...mergedDeleteButtonProps}
                    onClick={() => handleDeleteLine(i)}
                  >
                    {mergedDeleteButtonProps.deleteButtonText}
                  </Button>
                </Tooltip>
              )}
        </div>
      ))

      const $createButton =
        mergedCreateButtonProps === false
          ? null
          : props.column?.list?.renderCreateRecordButton?.(() =>
              handleCreateNewLine()
            ) ?? (
              <Button
                {...mergedCreateButtonProps}
                onClick={() => handleCreateNewLine()}
              >
                {mergedCreateButtonProps.creatorButtonText}
              </Button>
            )

      return (
        <>
          {$child}
          {$createButton}
        </>
      )
    }
  },
})
</script>
