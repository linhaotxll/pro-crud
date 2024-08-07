import { CopyOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { h, toValue } from 'vue'

import { getUuid, mergeWithTovalue } from '../common'

import type {
  InternalProFormColumnOptions,
  ProFormActionGroup,
  ProFormScope,
} from './interface'
import type { ProFormColumnOptions, ProFormListOptions } from './interface'
import type { DataObject } from '../common'
import type { ToastOptions } from '../Toast'
import type { ColProps, RowProps, SpaceProps } from 'ant-design-vue'
import type { CSSProperties } from 'vue'

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
export const buildDefaultProFormActionGroup = <
  Data extends DataObject = DataObject
>(
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
export const buildDefaultProSearchActionGroup = <
  Data extends DataObject = DataObject
>(
  scope: ProFormScope<DataObject>,
  commonCol: ColProps | undefined,
  columns: InternalProFormColumnOptions<Data>[],
  { col, ...rest }: ProFormActionGroup
): ProFormActionGroup => {
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
      // 每个列所占的格子数量，已经合并了公共和单独配置的数量
      // Pro Search 默认会设置公共 col
      const columnCol: ColProps = columnValue.col!

      const show = columnValue.show

      let columnTotal = 0
      if (show) {
        columnTotal += +(columnCol.span ?? 0) + +(columnCol.offset ?? 0)
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

  return mergeWithTovalue(
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
              await scope.submit()
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
export const DefaultProFormToast: ToastOptions = '保存成功'

// Pro Search Wrapper Col Props
export const DefaultProSearchWrapperColProps: ColProps & {
  style: CSSProperties
} = {
  style: { flexBasis: '0%' },
}
