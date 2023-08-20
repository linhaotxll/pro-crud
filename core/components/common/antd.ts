import type { InternalProTableColumnProps } from './../ProTable/interface'
import type { ColumnType as AntdColumnType } from 'ant-design-vue/es/table'

export interface ColumnType<T> extends AntdColumnType<T> {
  __column?: InternalProTableColumnProps<T>
}
