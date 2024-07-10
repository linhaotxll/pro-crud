import type { ModalFormActionGroup } from './interface'
import type { BuildFormOptionResult } from '../ProForm'

/**
 * 默认表单配置(优先级最高)
 */
export const defaultModalFormOption: BuildFormOptionResult<any> = {
  action: { show: false },
}

/**
 * Modal Form 默认按钮组
 */
export function buildModalFormDefaultAction(): ModalFormActionGroup {
  return {
    show: true,
    actions: {
      ok: {
        text: '确认',
        props: { type: 'primary' },
      },
      cancel: {
        text: '取消',
      },
    },
  }
}
