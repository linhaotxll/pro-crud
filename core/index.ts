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

import { DefaultValueType, mergeWithTovalue } from './components/common'
import { ModalForm } from './components/ModalForm'
import { ProButtonGroup } from './components/ProButton'
import { ProCrud } from './components/ProCrud'
import { ProForm, ProFormList } from './components/ProForm'
import { ProTable } from './components/ProTable'
import { StepsForm } from './components/StepsForm'
import { setGlobalOptions } from './constant'

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
    app.component(ModalForm.name!, ModalForm)
    app.component(ProCrud.name!, ProCrud)
    app.component(StepsForm.name!, StepsForm)

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

    const resolvedProComponentOptions: ResolvedProComponentsOptions =
      mergeWithTovalue({}, { types: DefaultValueType }, options)

    setGlobalOptions(resolvedProComponentOptions)
  },
}

export * from './components/ProForm'
export * from './components/ProCrud'
export * from './components/ProTable'
export * from './components/StepsForm'
export * from './components/ModalForm'
