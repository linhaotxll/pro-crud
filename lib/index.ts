// export * from './components/ProForm'

import { ProSelect } from './components/ProSelect'

import type { Plugin } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProComponentsOptions {}

export const ProComponents: Plugin<ProComponentsOptions> = {
  install(app, options) {
    app.component(ProSelect.name, ProSelect)
  },
}
