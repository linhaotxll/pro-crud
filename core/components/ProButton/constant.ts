import type { ActionGroupOption, ActionOption } from './interface'

/**
 * 默认按扭配置
 */
export const DefaultAction: ActionOption = {
  show: true,
  order: 1,
  confirmType: false,
}

/**
 * 默认按扭组配制
 */
export const DefaultActionGroup: ActionGroupOption<any> = {
  show: true,
}
