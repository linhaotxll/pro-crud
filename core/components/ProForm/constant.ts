import { CopyOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

import type { ProFormActionGroup } from './interface'
import type { ProFormColumnOptions, ProFormListOptions } from './interface'
import type { ColProps } from 'ant-design-vue'

/**
 * ProForm Column 默认配置
 */
export const DefaultProFormColumn: ProFormColumnOptions<any> = {
  show: true,
  preserve: true,
  type: 'text',
  submitted: true,
  fill: true,
}

/**
 * Pro Form 通用 Col 配置
 */
export const DefaultProFormCol: ColProps = { span: 24 }

export const DefaultCreateRecordButtonProps: ProFormListOptions['creatorButtonProps'] =
  {
    type: 'dashed',
    block: true,
    creatorButtonText: '添加',
  }

export const DefaultDeleteRecordButtonProps: ProFormListOptions['deleteButtonProps'] =
  {
    icon: h(DeleteOutlined),
  }

export const DefaultCopyRecordButtonProps: ProFormListOptions['copyButtonProps'] =
  {
    icon: h(CopyOutlined),
  }

/**
 * Pro Form 默认按钮组
 */
export const DefaultProFormActionGroup: ProFormActionGroup = {
  col: { span: 24 },
  show: true,
  actions: {
    confirm: {
      show: true,
      text: '提交',
      props: { type: 'primary' },
    },
  },
}
