import { ProForm, ProFormItem, DynamicVModel } from './components/ProForm'
import { ProRender } from './components/ProRender'
import { ProSearch } from './components/ProSearch'
import { ProSelect } from './components/ProSelect'

import type { Plugin } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProComponentsOptions {}

export const ProComponents: Plugin<ProComponentsOptions> = {
  install(app) {
    app.component(ProRender.name, ProRender)
    app.component(DynamicVModel.name, DynamicVModel)
    app.component(ProSearch.name, ProSearch)
    app.component(ProForm.name, ProForm)
    app.component(ProFormItem.name, ProFormItem)
    app.component(ProSelect.name, ProSelect)
  },
}

export * from './components/ProForm'
export * from './components/ProSearch'
export * from './components/ProSelect'
