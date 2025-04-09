import { toValue } from 'vue'
import { computed } from 'vue'

import { buildForm } from './buildForm'

import { mergeWithTovalue } from '../common'

import type {
  ProFormScope,
  BuildFormOptionResult,
  BuildFormResult,
} from './interface'
import type { DataObject } from '../common/interface'

export function buildSearch<
  T extends DataObject = DataObject,
  S extends DataObject = T
>(
  options: (scope: ProFormScope<T>) => BuildFormOptionResult<T, S>
): BuildFormResult<T> {
  // @ts-ignore
  return buildForm(scope => {
    const result = options(scope)
    return {
      ...result,
      formProps: computed(() =>
        mergeWithTovalue({}, toValue(result.formProps), { layout: 'inline' })
      ),
      action: computed(() =>
        mergeWithTovalue(
          {
            actions: {
              confirm: { props: { htmlType: 'submit' } },
            },
          },
          toValue(result.action)
        )
      ),
    }
  })
}
