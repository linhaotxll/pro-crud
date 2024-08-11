import { mount } from '@vue/test-utils'
import antdv, {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Select,
  Steps,
} from 'ant-design-vue'
import dayjs from 'dayjs'
import { describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import { StepsForm, buildStepsForm } from '..'
import { ProComponents } from '../../..'

import type { StepsFormScope } from '..'
import type { Dayjs } from 'dayjs'

const sleep = (time: number) => new Promise(r => setTimeout(r, time))

describe('StepsForm', () => {
  test('basic', async () => {
    let scope!: StepsFormScope
    const validateFail = vi.fn(() => {
      //
    })
    const infoBeforeSubmit = vi.fn((values: any) => ({
      ...values,
      a: 1,
    }))
    const infoSubmitRequest = vi.fn(() => {
      return true
    })

    const extendsBeforeSubmit = vi.fn((values: any) => ({
      ...values,
      b: 2,
    }))
    const extendsSubmitRequest = vi.fn(() => {
      return true
    })

    const topBeforeSubmit = vi.fn(values => {
      return {
        ...values,
        c: 3,
      }
    })
    const topSubmitRequest = vi.fn(() => {
      return true
    })

    const App = defineComponent({
      name: 'App',
      setup() {
        const { stepsFormBinding } = buildStepsForm(s => {
          scope = s

          return {
            steps: [
              {
                title: '基本信息',
                columns: [
                  {
                    label: '姓名',
                    name: 'name',
                  },
                ],
                validateFail,
                formProps: {
                  rules: {
                    name: { required: true, message: '请填写姓名' },
                  },
                },
                col: { span: 8 },
                beforeSubmit: infoBeforeSubmit,
                submitRequest: infoSubmitRequest,
              },

              {
                title: '扩展信息',
                columns: [
                  {
                    label: '学校',
                    name: 'school',
                    type: 'select',
                    dict: {
                      data: [{ label: '清华大学', value: 'qh' }],
                    },
                  },
                ],
                beforeSubmit: extendsBeforeSubmit,
                submitRequest: extendsSubmitRequest,
              },
            ],

            beforeSubmit: topBeforeSubmit,
            submitRequest: topSubmitRequest,
          }
        })
        return () => {
          return h(StepsForm, stepsFormBinding)
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv, ProComponents],
      },
    })

    expect(wrapper.findAllComponents(Steps).length).toBe(1)

    expect(wrapper.findAllComponents(Input).length).toBe(1)

    expect(wrapper.findComponent(Steps).vm.$props.items).toMatchInlineSnapshot(`
      [
        {
          "description": undefined,
          "disabled": undefined,
          "icon": undefined,
          "onClick": undefined,
          "status": undefined,
          "subTitle": undefined,
          "title": "基本信息",
        },
        {
          "description": undefined,
          "disabled": undefined,
          "icon": undefined,
          "onClick": undefined,
          "status": undefined,
          "subTitle": undefined,
          "title": "扩展信息",
        },
      ]
    `)

    expect(wrapper.findAllComponents(Button).length).toBe(1)
    expect(wrapper.findAllComponents(Button)[0].text()).toBe('下一步')

    await wrapper.findAllComponents(Button)[0].vm.$emit('click')
    await sleep(0)

    expect(validateFail).toHaveBeenCalledTimes(1)
    expect((validateFail.mock.calls[0] as any)[0]).toMatchInlineSnapshot(`
      {
        "errorFields": [
          {
            "errors": [
              "请填写姓名",
            ],
            "name": [
              "name",
            ],
            "warnings": [],
          },
        ],
        "outOfDate": false,
        "values": {
          "name": undefined,
        },
      }
    `)

    scope.setFieldValue('name', 'IconMan')

    await nextTick()

    expect(wrapper.findComponent(Input).vm.$props.value).toBe('IconMan')
    expect(wrapper.findComponent(Input).find('input').element.value).toBe(
      'IconMan'
    )

    await wrapper.findAllComponents(Button)[0].find('button').trigger('click')
    await sleep(0)

    expect(validateFail).toHaveBeenCalledTimes(1)
    expect(infoBeforeSubmit).toHaveReturnedTimes(1)
    expect(infoBeforeSubmit).toHaveBeenCalledWith({ name: 'IconMan' })
    expect(infoSubmitRequest).toHaveBeenCalledTimes(1)
    expect(infoSubmitRequest).toHaveBeenCalledWith({ name: 'IconMan', a: 1 })

    expect(wrapper.findAllComponents(Input).length).toBe(0)
    expect(wrapper.findAllComponents(Select).length).toBe(1)
    expect(wrapper.findComponent(Steps).vm.$props.current).toBe(1)

    expect(wrapper.findAllComponents(Button).length).toBe(2)
    expect(wrapper.findAllComponents(Button)[0].text()).toBe('完 成')
    expect(wrapper.findAllComponents(Button)[1].text()).toBe('上一步')

    scope.setFieldValue('school', 'qh')
    await nextTick()

    wrapper.findAllComponents(Button)[0].vm.$emit('click')
    await sleep(0)

    expect(extendsBeforeSubmit).toHaveBeenCalledTimes(1)
    expect(extendsBeforeSubmit).toHaveBeenCalledWith({
      name: 'IconMan',
      school: 'qh',
    })
    expect(extendsSubmitRequest).toHaveBeenCalledTimes(1)
    expect(extendsSubmitRequest).toHaveBeenCalledWith({
      name: 'IconMan',
      school: 'qh',
      b: 2,
    })

    expect(wrapper.findComponent(Steps).vm.$props.current).toBe(1)

    expect(infoBeforeSubmit).toHaveBeenCalledTimes(1)
    expect(extendsBeforeSubmit).toHaveBeenCalledTimes(1)

    expect(topBeforeSubmit).toHaveBeenCalledTimes(1)
  })

  test('next page', async () => {
    const transformTo = vi.fn((formValue: Dayjs | null) => {
      return formValue?.format('YYYY年MM月DD日')
    })

    const transformFrom = vi.fn((serverValue: string | null) => {
      return serverValue ? dayjs(serverValue, 'YYYY年MM月DD日') : null
    })

    const topSubmitRequest = vi.fn(() => {
      return true
    })

    const initialDate = '2024年08月11日'
    // const initialDay = dayjs(initialDate)

    const App = defineComponent({
      name: 'App',
      setup() {
        const { stepsFormBinding } = buildStepsForm(() => {
          return {
            initialValues: {
              name: 'IconMan',
              startDate: initialDate,
            },
            steps: [
              {
                title: '基本信息',
                columns: [
                  {
                    label: '姓名',
                    name: 'name',
                  },
                ],
              },

              {
                title: '扩展信息',
                columns: [
                  {
                    label: '日期',
                    name: 'startDate',
                    type: 'date',
                    transform: {
                      from: transformFrom,
                      to: transformTo,
                    },
                  },
                ],
              },
            ],

            submitRequest: topSubmitRequest,
          }
        })
        return () => {
          return h(StepsForm, stepsFormBinding)
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv, ProComponents],
      },
    })

    expect(wrapper.findAllComponents(Steps).length).toBe(1)
    expect(wrapper.findAllComponents(Steps)[0].vm.$props.current).toBe(0)
    expect(wrapper.findAllComponents(Input).length).toBe(1)
    expect(wrapper.findAllComponents(Input)[0].vm.$props.value).toBe('IconMan')

    await wrapper.findComponent(Button).vm.$emit('click')
    await sleep(0)

    expect(wrapper.findAllComponents(Steps)[0].vm.$props.current).toBe(1)
    expect(wrapper.findAllComponents(Input).length).toBe(0)
    expect(wrapper.findAllComponents(DatePicker).length).toBe(1)
    expect(transformFrom).toHaveBeenCalledTimes(1)
    expect(transformFrom).toHaveBeenCalledWith(initialDate)

    await wrapper.findComponent(Button).vm.$emit('click')
    await sleep(0)

    expect(wrapper.findAllComponents(Steps)[0].vm.$props.current).toBe(1)
    expect(transformTo).toHaveBeenCalledTimes(1)

    expect(transformTo).toHaveReturnedWith(initialDate)

    expect(topSubmitRequest).toHaveBeenCalledTimes(1)
    expect(topSubmitRequest).toHaveBeenCalledWith({
      name: 'IconMan',
      startDate: initialDate,
    })
  })

  test('custom render wrap', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const { stepsFormBinding } = buildStepsForm(() => {
          return {
            steps: [
              {
                title: '基本信息',
                columns: [
                  {
                    label: '姓名',
                    name: 'name',
                  },
                ],
                formProps: {
                  rules: {
                    name: { required: true, message: '请填写姓名' },
                  },
                },
                col: { span: 8 },
              },
              {
                title: '扩展信息',
                columns: [
                  {
                    label: '学校',
                    name: 'school',
                    type: 'select',
                    dict: {
                      data: [{ label: '清华大学', value: 'qh' }],
                    },
                  },
                ],
              },
            ],

            wrap: {
              render: ctx =>
                h('div', { class: 'wrap-container' }, [
                  h('div', { class: 'wrap-steps' }, [ctx.$steps]),
                  h('div', { class: 'wrap-form' }, [ctx.$form]),
                ]),
            },
          }
        })
        return () => {
          return h(StepsForm, stepsFormBinding)
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv, ProComponents],
      },
    })

    expect(wrapper.findAllComponents(Flex).length).toBe(0)
    expect(wrapper.find('.wrap-container').exists()).toBe(true)
    expect(wrapper.find('.wrap-steps').findAllComponents(Steps).length).toBe(1)
    expect(wrapper.find('.wrap-form').findAllComponents(Form).length).toBe(1)
  })
})
