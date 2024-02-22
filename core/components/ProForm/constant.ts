import { CopyOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

import type { ProFormColumnOptions, ProFormListOptions } from './interface'
import type { SuccessToastOptions } from '../Toast'
import type { ColProps } from 'ant-design-vue'

export const ProFormInstanceNames = [
  'submit',
  'reset',
  'resetFields',
  'setFieldValue',
  'setFieldValues',
  'setFieldValuesTransform',
  'getFieldValue',
  'removeFields',
  'validate',
  'validateField',
  'scrollToField',
  'clearValidate',
  'getFieldInstance',
  'getFormValues',
] as const

export const DefaultProProColumn: ProFormColumnOptions<any> = {
  show: true,
  preserve: true,
  type: 'text',
  submitted: true,
  fill: true,
}

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

export const successToast: SuccessToastOptions = '保存成功'
