// import {
//   vLoading,
//   ElSpace,
//   ElIcon,
//   ElDropdown,
//   ElDropdownMenu,
//   ElDropdownItem,
//   ElTree,
// } from 'element-plus'

import {
  Form,
  Row,
  Col,
  Tooltip,
  Input,
  Select,
  InputNumber,
  Slider,
  Switch,
  DatePicker,
  TimePicker,
  Button,
  Space,
  Cascader,
} from 'ant-design-vue'

import { ProCrud } from './components/ProCrud'
import { ProDictionary, ProSelect } from './components/ProDictionary'
import { ProForm } from './components/ProForm'
import { ProRender } from './components/ProRender'
import { ProSearch } from './components/ProSearch'
import { ProTable } from './components/ProTable'
import { GlobalOption } from './constant'

import type { ProComponentsOptions } from './constant'
import type { Plugin } from 'vue'

export const ProComponents: Plugin<ProComponentsOptions> = {
  install(app, options) {
    app.component(ProCrud.name, ProCrud)
    app.component(ProTable.name, ProTable)
    app.component(ProRender.name, ProRender)
    app.component(ProSearch.name, ProSearch)
    app.component(ProForm.name, ProForm)
    app.component(ProSelect.name, ProSelect)
    app.component(ProDictionary.name, ProDictionary)

    app
      .use(Form)
      .use(Input)
      .use(Col)
      .use(Row)
      .use(Tooltip)
      .use(Select)
      .use(InputNumber)
      .use(Slider)
      .use(Switch)
      .use(DatePicker)
      .use(TimePicker)
      .use(Button)
      .use(Space)
      .use(Cascader)
    // app.use(ElSpace, ElIcon, ElDropdown, ElDropdownMenu, ElDropdownItem, ElTree)

    // app.directive('v-loading', vLoading)

    app.provide(GlobalOption, options)
  },
}

export * from './components/ProForm'
export * from './components/ProSearch'
export * from './components/ProCrud'
