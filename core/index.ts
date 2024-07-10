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
  Table,
  Dropdown,
  Menu,
  Tag,
  Spin,
  Modal,
  ConfigProvider,
} from 'ant-design-vue'
import { merge } from 'lodash-es'

import { DefaultValueType } from './components/common'
import { ProButtonGroup } from './components/ProButton'
import { ProForm, ProFormList } from './components/ProForm'
import { ProTable } from './components/ProTable'
import { GlobalOption } from './constant'

import type {
  ProComponentsOptions,
  ResolvedProComponentsOptions,
} from './interface'
import type { Plugin } from 'vue'

export const ProComponents: Plugin<ProComponentsOptions> = {
  install(app, options) {
    app.component(ProTable.name!, ProTable)
    app.component(ProForm.name!, ProForm)
    app.component(ProFormList.name!, ProFormList)
    app.component(ProButtonGroup.name!, ProButtonGroup)

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
      .use(Table)
      .use(Dropdown)
      .use(Menu)
      .use(Tag)
      .use(Spin)
      .use(Modal)
      .use(ConfigProvider)

    const resolvedProComponentOptions: ResolvedProComponentsOptions = merge(
      {},
      { types: DefaultValueType },
      options
    )

    app.provide(GlobalOption, resolvedProComponentOptions)
  },
}

export * from './components/ProForm'
export * from './components/ProCrud'
export * from './components/ProTable'
