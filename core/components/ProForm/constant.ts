import { CopyOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { merge } from 'lodash-es'
import { h, toValue } from 'vue'

import { getUuid, mergeWithTovalue } from '../common'

import type {
  InternalProFormColumnOptions,
  ProFormActionGroup,
  ProFormScope,
} from './interface'
import type { ProFormColumnOptions, ProFormListOptions } from './interface'
import type { SuccessToastOptions } from '../Toast'
import type { ColProps, RowProps, SpaceProps } from 'ant-design-vue'
import type { CSSProperties, Ref } from 'vue'

/**
 * ProForm Column 默认配置
 */
export const DefaultProFormColumn: ProFormColumnOptions<any> = {
  show: true,
  name: '',
  preserve: true,
  type: 'text',
  submitted: true,
  fill: true,
}

/**
 * Pro Form 通用 Col 配置
 */
export const DefaultProFormCol: ColProps = { span: 24 }

/**
 * Pro Search 通用 Col 配置
 */
export const DefaultProSearchCol: ColProps = { span: 4 }

/**
 * 默认添加按钮
 */
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
export const buildDefaultProFormActionGroup = <Data = any>(
  scope: ProFormScope<Data>
): ProFormActionGroup => ({
  col: { span: 24 },
  show: true,
  actions: {
    confirm: {
      show: true,
      text: '提交',
      props: {
        type: 'primary',
        onClick: async () => {
          await scope.submit()
        },
      },
    },
  },
})

/**
 * Pro Search 默认按钮组
 */
export const buildDefaultProSearchActionGroup = <Data = any>(
  scope: ProFormScope<Data>,
  commonCol: ColProps | undefined,
  columns: Ref<InternalProFormColumnOptions<Data>>[],
  { col, ...rest }: ProFormActionGroup
): ProFormActionGroup => {
  // const defaultSpan = commonCol?.span ?? toValue(col)?.span ?? DefaultProSearchCol.span!
  const resolvedCol: ColProps = mergeWithTovalue(
    {
      span: DefaultProSearchCol.span!,
      offset: 0,
    },
    commonCol,
    toValue(col)
  )

  const total =
    columns.reduce<number>((prev, column) => {
      const columnValue = toValue(column)
      // 每个列所占的格子数量
      const columnCol: ColProps | undefined = columnValue.col

      const show = columnValue.show

      let columnTotal = 0
      if (show) {
        if (columnCol) {
          columnTotal += +(columnCol.span ?? 0) + +(columnCol.offset ?? 0)
        } else {
          columnTotal += +(commonCol?.span ?? 0) + +(commonCol?.offset ?? 0)
        }
      }

      const result = prev + columnTotal

      if (result > 24) {
        prev = 0
      }

      prev += columnTotal

      return prev
    }, 0) ?? 0

  const span = +resolvedCol.span!

  let offset = 0
  const residueSpan = 24 - total
  if (residueSpan < span) {
    offset = 24 - span
  } else {
    offset = 24 - total - span
  }

  resolvedCol.offset = offset

  return merge(
    {
      col: resolvedCol,
      show: true,
      actions: {
        reset: {
          show: true,
          text: '重置',
          props: {
            type: 'default',
            async onClick() {
              scope.reset()
            },
          },
        },
        confirm: {
          show: true,
          text: '提交',
          props: {
            type: 'primary',
            async onClick() {
              await scope.submit()
            },
          },
        },
      },
    },
    rest
  )
}

/**
 * Pro Search Row
 */
export const DefaultProSearchRow: RowProps & { style: CSSProperties } = {
  gutter: 8,
  style: { width: '100%' },
}

export const ProFormListPlaceholder = getUuid() + '__placeholder__'

/**
 * 每行 Space Props
 */
export const DefaultFormListSpaceProps: SpaceProps = {
  // TODO: 查找 style 对应的类型声明
  // @ts-ignore
  style: { width: '100%' },
  align: 'start',
}

// Pro Form Toast
export const DefaultProFormToast: SuccessToastOptions = '保存成功'
