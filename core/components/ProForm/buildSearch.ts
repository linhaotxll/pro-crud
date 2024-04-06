import { merge } from 'lodash-es'

import { buildForm } from './buildForm'

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
  return buildForm(scope => {
    return merge({}, options(scope), { formProps: { layout: 'inline' } })
  })
}
