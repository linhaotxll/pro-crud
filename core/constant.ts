import { DefaultValueType } from './components/common'

import type { ResolvedProComponentsOptions } from './interface'

let _options: ResolvedProComponentsOptions

export function setGlobalOptions(options: ResolvedProComponentsOptions) {
  _options = options
}

export function getGlobalOptions() {
  return _options ?? { types: DefaultValueType }
}
