import {
  UploadFilled,
  Tools,
  Refresh,
  DCaret,
  Sort,
} from '@element-plus/icons-vue'
import {
  vLoading,
  ElSpace,
  ElIcon,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElTree,
} from 'element-plus'

import { DropdownSelect } from './components/DropdownSelect'
import { ProCrud } from './components/ProCrud'
import { ProForm, ProFormItem, DynamicVModel } from './components/ProForm'
import { ProRender } from './components/ProRender'
import { ProSearch } from './components/ProSearch'
import { ProSelect } from './components/ProSelect'
import { ProTable, ProTableColumn } from './components/ProTable'

import type { Plugin } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProComponentsOptions {}

export const ProComponents: Plugin<ProComponentsOptions> = {
  install(app) {
    app.component(ProCrud.name, ProCrud)
    app.component(ProTable.name, ProTable)
    app.component(ProTableColumn.name, ProTableColumn)
    app.component(ProRender.name, ProRender)
    app.component(DynamicVModel.name, DynamicVModel)
    app.component(ProSearch.name, ProSearch)
    app.component(ProForm.name, ProForm)
    app.component(ProFormItem.name, ProFormItem)
    app.component(ProSelect.name, ProSelect)
    app.component(DropdownSelect.name, DropdownSelect)

    app.component(Refresh.name, Refresh)
    app.component(Tools.name, Tools)
    app.component(UploadFilled.name, UploadFilled)
    app.component(DCaret.name, DCaret)
    app.component(Sort.name, Sort)

    app.use(ElSpace, ElIcon, ElDropdown, ElDropdownMenu, ElDropdownItem, ElTree)

    app.directive('v-loading', vLoading)
  },
}

export * from './components/ProForm'
export * from './components/ProSearch'
export * from './components/ProSelect'
