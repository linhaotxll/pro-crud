import type { UnionToTuple } from '../common/interface'

export const tablePropsNameMap = {
  height: true,
  maxHeight: true,
  stripe: true,
  border: true,
  size: true,
  fit: true,
  showHeader: true,
  highlightCurrentRow: true,
  currentRowKey: true,
  rowClassName: true,
  rowStyle: true,
  cellClassName: true,
  cellStyle: true,
  headerRowClassName: true,
  headerRowStyle: true,
  headerCellClassName: true,
  headerCellStyle: true,
  rowKey: true,
  expandRowKeys: true,
  tooltipEffect: true,
  tooltipOptions: true,
  showSummary: true,
  sumText: true,
  summaryMethod: true,
  spanMethod: true,
  selectOnIndeterminate: true,
  indent: true,
  lazy: true,
  load: true,
  treeProps: true,
  tableLayout: true,
  scrollbarAlwaysOn: true,
  showOverflowTooltip: true,
  flexible: true,
} as const

export const tablePropsNames = Object.keys(tablePropsNameMap) as UnionToTuple<
  keyof typeof tablePropsNameMap
>

export const tableColumnPropsNameMap = {
  type: true,
  index: true,
  columnKey: true,
  width: true,
  minWidth: true,
  fixed: true,
  renderHeader: true,
  sortable: true,
  sortMethod: true,
  sortBy: true,
  sortOrders: true,
  resizable: true,
  formatter: true,
  showOverflowTooltip: true,
  align: true,
  headerAlign: true,
  className: true,
  labelClassName: true,
  selectable: true,
  reserveSelection: true,
  filters: true,
  filterPlacement: true,
  filterMultiple: true,
  filterMethod: true,
  filteredValue: true,
}

export const tableColumnPropsNames = Object.keys(
  tableColumnPropsNameMap
) as UnionToTuple<keyof typeof tableColumnPropsNameMap>
