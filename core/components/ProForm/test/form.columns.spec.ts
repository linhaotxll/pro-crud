import { mount } from '@vue/test-utils'
import antdv, { Col, FormItem, Input } from 'ant-design-vue'
import { describe, test, expect, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { ProForm, ProFormItem, buildForm } from '..'

import type { InternalProFormColumnOptions } from '..'
import type { ColProps } from 'ant-design-vue'
import type { Ref } from 'vue'

describe('Pro Form Columns', () => {
  test('columns.col has default value', async () => {
    const { proFormBinding } = buildForm(() => {
      return {
        columns: [{ label: '用户名', name: 'username' }],
      }
    })

    const wrapper = mount(ProForm, {
      props: proFormBinding,
      global: {
        plugins: [antdv], // 修改这里
      },
    })

    const col = wrapper.findComponent(Col)
    expect(col.exists()).toBe(true)
    expect(col.classes().includes('ant-col-24')).toBe(true)
  })

  test('columns.col is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const col = ref<ColProps>({ span: 1 })

        const { proFormBinding } = buildForm(() => {
          return {
            columns: [{ label: '用户名', name: 'username', col }],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                col.value = { span: (col.value.span as number) + 1 }
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    const col = wrapper.findComponent(Col)
    expect(col.exists()).toBe(true)
    expect(col.classes().includes('ant-col-1')).toBe(true)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    expect(col.classes().includes('ant-col-2')).toBe(true)

    await button.trigger('click')
    expect(col.classes().includes('ant-col-3')).toBe(true)
  })

  test('columns.col attr is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const span = ref(1)
        const col = { span }

        const { proFormBinding } = buildForm(() => {
          return {
            columns: [{ label: '用户名', name: 'username', col }],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                span.value++
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    const col = wrapper.findComponent(Col)
    expect(col.exists()).toBe(true)
    expect(col.classes().includes('ant-col-1')).toBe(true)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    expect(col.classes().includes('ant-col-2')).toBe(true)

    await button.trigger('click')
    expect(col.classes().includes('ant-col-3')).toBe(true)
  })

  test('columns.col show is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const show = ref(true)

        const { proFormBinding } = buildForm(() => {
          return {
            columns: [{ label: '用户名', name: 'username', show }],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                show.value = !show.value
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    const formItem = wrapper.findComponent(ProFormItem)
    const input = wrapper.findComponent(Input)
    expect(input.exists()).toBe(true)
    expect(formItem.exists()).toBe(true)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(input.exists()).toBe(false)
    // expect(formItem.exists()).toBe(false)
    // expect(col.classes().includes('ant-col-2')).toBe(true)

    // await button.trigger('click')
    // expect(col.classes().includes('ant-col-3')).toBe(true)
  })

  test('columns.itemProps is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const itemProps = ref({ required: true })

        const { proFormBinding } = buildForm(() => {
          return {
            columns: [
              {
                label: '用户名',
                name: 'username',
                itemProps,
              },
            ],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                itemProps.value = { required: !itemProps.value.required }
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.classes().includes('ant-form-item-required')).toBe(true)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    expect(label.classes().includes('ant-form-item-required')).toBe(false)

    await button.trigger('click')
    expect(label.classes().includes('ant-form-item-required')).toBe(true)
  })

  test('columns.itemProps attr is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const required = ref(true)

        const { proFormBinding } = buildForm(() => {
          return {
            columns: [
              { label: '用户名', name: 'username', itemProps: { required } },
            ],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                required.value = !required.value
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.classes().includes('ant-form-item-required')).toBe(true)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    expect(label.classes().includes('ant-form-item-required')).toBe(false)

    await button.trigger('click')
    expect(label.classes().includes('ant-form-item-required')).toBe(true)
  })

  test('columns.fieldProps is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const fieldProps = ref({ disabled: false }) as Ref<any>

        const { proFormBinding } = buildForm(() => {
          return {
            columns: [{ label: '用户名', name: 'username', fieldProps }],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                fieldProps.value = { disabled: !fieldProps.value.disabled }
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    const input = wrapper.findComponent(Input).find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('disabled')).toBe(undefined)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    expect(input.attributes('disabled')).toBe('')

    await button.trigger('click')
    expect(input.attributes('disabled')).toBe(undefined)
  })

  test('columns.fieldProps attr is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const disabled = ref(false)

        const { proFormBinding } = buildForm(() => {
          return {
            columns: [
              { label: '用户名', name: 'username', fieldProps: { disabled } },
            ],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                disabled.value = !disabled.value
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    const input = wrapper.findComponent(Input).find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('disabled')).toBe(undefined)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    expect(input.attributes('disabled')).toBe('')

    await button.trigger('click')
    expect(input.attributes('disabled')).toBe(undefined)
  })

  test('column.label wrapper col is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const formLabelCol = ref({ span: 4 }) as Ref<ColProps>
        const formWrapperCol = ref({ span: 20 }) as Ref<ColProps>

        const labelCol = ref({ span: 6 }) as Ref<ColProps>
        const wrapperCol = ref({ span: 18 }) as Ref<ColProps>

        const { proFormBinding } = buildForm(() => {
          return {
            labelCol: formLabelCol,
            wrapperCol: formWrapperCol,
            columns: [
              {
                label: '用户名',
                name: 'username',
                itemProps: { labelCol, wrapperCol },
              },
            ],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                formLabelCol.value = {
                  span: (formLabelCol.value.span as number) + 1,
                }
                labelCol.value = { span: (labelCol.value.span as number) + 1 }

                wrapperCol.value = {
                  span: (wrapperCol.value.span as number) - 1,
                }
                formWrapperCol.value = {
                  span: (formWrapperCol.value.span as number) - 1,
                }
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    const cols = wrapper.findComponent(FormItem).findAllComponents(Col)
    expect(cols.length).toBe(2)

    expect(cols[0].classes().includes('ant-col-6')).toBe(true)
    expect(cols[1].classes().includes('ant-col-18')).toBe(true)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(cols[0].classes().includes('ant-col-7')).toBe(true)
    expect(cols[1].classes().includes('ant-col-17')).toBe(true)

    await button.trigger('click')

    expect(cols[0].classes().includes('ant-col-8')).toBe(true)
    expect(cols[1].classes().includes('ant-col-16')).toBe(true)
  })

  test('column.itemSlots is ref', async () => {
    let firstColumn: InternalProFormColumnOptions<any> | null = null

    const prevItemSlots = {
      extra: vi.fn(() => 'extra'),
      help: vi.fn(() => 'help'),
      label: vi.fn(() => 'label'),
      tooltip: vi.fn(() => 'tooltip'),
    }

    const nextItemSlots = {
      extra: vi.fn(() => 'extra1'),
      help: vi.fn(() => 'help1'),
      label: vi.fn(() => 'label1'),
      tooltip: vi.fn(() => 'tooltip1'),
    }

    const App = defineComponent({
      name: 'App',
      setup() {
        const itemSlots = ref<any>(prevItemSlots)

        const { proFormBinding } = buildForm(() => {
          return {
            columns: [
              {
                name: 'username',
                itemSlots,
                itemProps: { validateStatus: 'error' },
              },
            ],
          }
        })

        firstColumn = proFormBinding.columns.value[0].value

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                itemSlots.value = nextItemSlots
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(firstColumn).not.toBe(null)

    const labels = wrapper.findAll('label')
    expect(labels.length).toBe(1)

    expect(labels[0].text()).toBe('labeltooltip')
    expect(wrapper.find('.ant-form-show-help').text()).toBe('help')
    expect(wrapper.find('.ant-form-item-extra').text()).toBe('extra')

    expect(prevItemSlots.tooltip).toHaveBeenCalledTimes(1)
    expect(prevItemSlots.label).toHaveBeenCalledTimes(1)
    expect(prevItemSlots.help).toHaveBeenCalledTimes(1)
    expect(prevItemSlots.extra).toHaveBeenCalledTimes(1)

    expect(prevItemSlots.tooltip.mock.calls[0].length).toBe(2)
    expect(prevItemSlots.tooltip).toHaveBeenCalledWith(firstColumn, {
      class: 'ant-form-item-tooltip',
    })
    expect(prevItemSlots.label).toHaveBeenCalledWith(firstColumn)
    expect(prevItemSlots.help).toHaveBeenCalledWith(firstColumn)
    expect(prevItemSlots.extra).toHaveBeenCalledWith(firstColumn)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(labels[0].text()).toBe('label1tooltip1')
    expect(wrapper.find('.ant-form-show-help').text()).toBe('help1')
    expect(wrapper.find('.ant-form-item-extra').text()).toBe('extra1')

    expect(prevItemSlots.tooltip).toHaveBeenCalledTimes(1)
    expect(prevItemSlots.label).toHaveBeenCalledTimes(1)
    expect(prevItemSlots.help).toHaveBeenCalledTimes(1)
    expect(prevItemSlots.extra).toHaveBeenCalledTimes(1)

    expect(nextItemSlots.tooltip).toHaveBeenCalledTimes(1)
    expect(nextItemSlots.label).toHaveBeenCalledTimes(1)
    expect(nextItemSlots.help).toHaveBeenCalledTimes(1)
    expect(nextItemSlots.extra).toHaveBeenCalledTimes(1)
  })

  test('column.fieldSlots is ref', async () => {
    let firstColumn: InternalProFormColumnOptions<any> | null = null

    const prevSlotsSlots = {
      prefix: vi.fn(() => 'prefix'),
    }

    const nextSlotsSlots = {
      prefix: vi.fn(() => 'prefix1'),
    }

    const App = defineComponent({
      name: 'App',
      setup() {
        const fieldSlots = ref<any>(prevSlotsSlots)

        const { proFormBinding } = buildForm(() => {
          return {
            columns: [
              {
                name: 'username',
                fieldSlots,
              },
            ],
          }
        })

        firstColumn = proFormBinding.columns.value[0].value

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                fieldSlots.value = nextSlotsSlots
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(firstColumn).not.toBe(null)

    const prefix = wrapper.find('.ant-input-prefix')
    expect(prefix.exists()).toBe(true)

    expect(prefix.text()).toBe('prefix')
    expect(prevSlotsSlots.prefix).toHaveBeenCalledTimes(1)

    expect(prevSlotsSlots.prefix.mock.calls[0].length).toBe(1)
    expect(prevSlotsSlots.prefix).toHaveBeenCalledWith(firstColumn)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(prefix.text()).toBe('prefix1')
    expect(prevSlotsSlots.prefix).toHaveBeenCalledTimes(1)
    expect(nextSlotsSlots.prefix).toHaveBeenCalledTimes(1)

    expect(nextSlotsSlots.prefix.mock.calls[0].length).toBe(1)
  })

  test('column.fill is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const fill = ref(false)

        const { proFormBinding } = buildForm(() => {
          return {
            columns: [
              {
                label: '用户名',
                name: 'username',
                fill,
              },
            ],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                fill.value = !fill.value
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findAll('input').length).toBe(1)
    expect(wrapper.findAll('input')[0].attributes('style')).toBe(undefined)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(wrapper.findAll('input')[0].attributes('style')).toBe('width: 100%;')

    await button.trigger('click')
    expect(wrapper.findAll('input')[0].attributes('style')).toBe(undefined)
  })
})
