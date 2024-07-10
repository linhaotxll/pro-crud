import { toValue } from 'vue'

import { defaultModalFormOption } from './constant'

import { mergeWithTovalue, type DataObject } from '../common'
import { buildForm } from '../ProForm'

import type { BuildModalFormOptionReturn } from './interface'
import type { ProFormScope } from '../ProForm'

export function buildModalForm<
  Data extends DataObject = DataObject,
  R extends DataObject = Data,
  Collection = any
>(
  options: (
    scope: ProFormScope<Data>
  ) => BuildModalFormOptionReturn<Data, R, Collection>
) {
  buildForm<Data, R>(scope => {
    const {
      // renderTrigger = () => (
      //   <Button type="primary" icon={<PlusOutlined />}>
      //     新建表单
      //   </Button>
      // ),
      // open,
      // modalProps,
      form,
    } = options(scope)

    return mergeWithTovalue({}, toValue(form), defaultModalFormOption)
  })
}
