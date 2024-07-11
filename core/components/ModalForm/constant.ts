import { Button } from 'ant-design-vue'
import { h } from 'vue'

import type { ModalFormActionGroup, ModalFormScope } from './interface'
import type { DataObject } from '../common'
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
export function buildModalFormDefaultAction<
  Data extends DataObject = DataObject
>(scope: ModalFormScope<Data>): ModalFormActionGroup {
  return {
    show: true,
    actions: {
      cancel: {
        text: '取消',
        props: {
          onClick() {
            scope.hideModal()
          },
        },
      },
      ok: {
        text: '确认',
        props: {
          type: 'primary',
          async onClick() {
            const res = await scope.submit()
            return res
          },
        },
      },
    },
  }
}

export function buildDefaultRenderTrigger(scope: ModalFormScope) {
  return h(
    Button,
    {
      type: 'primary',
      onClick() {
        scope.showModal()
      },
    },
    () => '新建表单'
  )
}
