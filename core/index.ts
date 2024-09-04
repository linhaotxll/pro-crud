// import {
//   Input,
//   Select,
//   InputNumber,
//   Slider,
//   Switch,
//   DatePicker,
//   TimePicker,
//   Cascader,
//   Button,
//   Form,
//   Table,
//   Popconfirm,
//   Space,
//   Col,
//   Row,
//   Flex,
//   Steps,
// } from 'ant-design-vue'

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

    // app.use(Flex)
    // app.use(Col)
    // app.use(Row)
    // app.use(Space)
    // app.use(Popconfirm)
    // app.use(Form)
    // app.use(Table)
    // app.use(Button)
    // app.use(Input)
    // app.use(InputNumber)
    // app.use(Slider)
    // app.use(Switch)
    // app.use(DatePicker)
    // app.use(TimePicker)
    // app.use(Cascader)
    // app.use(Steps)
    // app.use(Select)

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
