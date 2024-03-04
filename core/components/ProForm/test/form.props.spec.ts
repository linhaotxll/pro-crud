import { mount } from '@vue/test-utils'
import antdv, { Col, FormItem, Row } from 'ant-design-vue'
import { Input } from 'ant-design-vue'
import { describe, test, expect } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { ProForm, buildForm } from '../'

import type { ColProps } from 'ant-design-vue'
import type { Ref } from 'vue'

describe('Pro Form Props', () => {
  test('form props is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const formProps = ref({
          disabled: false,
        })

        const { proFormBinding } = buildForm(() => {
          return {
            formProps,
            columns: [{ label: '用户名', name: 'username' }],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                formProps.value = { disabled: !formProps.value.disabled }
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv], // 修改这里
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

  test('form props attr is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const disabled = ref(false)
        const formProps = { disabled }

        const { proFormBinding } = buildForm(() => {
          return {
            formProps,
            columns: [{ label: '用户名', name: 'username' }],
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
        plugins: [antdv], // 修改这里
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

  test('form row is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const row = ref({ gutter: 8 })

        const { proFormBinding } = buildForm(() => {
          return {
            row,
            columns: [{ label: '用户名', name: 'username' }],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                row.value = { gutter: 16 }
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv], // 修改这里
      },
    })

    const row = wrapper.findComponent(Row)
    expect(row.exists()).toBe(true)
    expect(row.attributes('style')).toBe(
      'margin-left: -4px; margin-right: -4px;'
    )

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)
    await button.trigger('click')

    expect(row.attributes('style')).toBe(
      'margin-left: -8px; margin-right: -8px;'
    )
  })

  test('form row attr is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const gutter = ref(8)
        const row = { gutter }

        const { proFormBinding } = buildForm(() => {
          return {
            row,
            columns: [{ label: '用户名', name: 'username' }],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                gutter.value = 16
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv], // 修改这里
      },
    })

    const row = wrapper.findComponent(Row)
    expect(row.exists()).toBe(true)
    expect(row.attributes('style')).toBe(
      'margin-left: -4px; margin-right: -4px;'
    )

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)
    await button.trigger('click')

    expect(row.attributes('style')).toBe(
      'margin-left: -8px; margin-right: -8px;'
    )
  })

  test('form label wrapper col is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const labelCol = ref({ span: 4 }) as Ref<ColProps>
        const wrapperCol = ref({ span: 20 }) as Ref<ColProps>

        const { proFormBinding } = buildForm(() => {
          return {
            labelCol,
            wrapperCol,
            columns: [{ label: '用户名', name: 'username' }],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                labelCol.value = { span: (labelCol.value.span as number) + 1 }
                wrapperCol.value = {
                  span: (wrapperCol.value.span as number) - 1,
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

    expect(cols[0].classes().includes('ant-col-4')).toBe(true)
    expect(cols[1].classes().includes('ant-col-20')).toBe(true)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(cols[0].classes().includes('ant-col-5')).toBe(true)
    expect(cols[1].classes().includes('ant-col-19')).toBe(true)

    await button.trigger('click')

    expect(cols[0].classes().includes('ant-col-6')).toBe(true)
    expect(cols[1].classes().includes('ant-col-18')).toBe(true)
  })

  test('form label wrapper col attr is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const labelColSpan = ref(4)
        const wrapperColSpan = ref(20)

        const { proFormBinding } = buildForm(() => {
          return {
            labelCol: { span: labelColSpan },
            wrapperCol: { span: wrapperColSpan },
            columns: [{ label: '用户名', name: 'username' }],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                labelColSpan.value++
                wrapperColSpan.value--
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

    expect(cols[0].classes().includes('ant-col-4')).toBe(true)
    expect(cols[1].classes().includes('ant-col-20')).toBe(true)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(cols[0].classes().includes('ant-col-5')).toBe(true)
    expect(cols[1].classes().includes('ant-col-19')).toBe(true)

    await button.trigger('click')

    expect(cols[0].classes().includes('ant-col-6')).toBe(true)
    expect(cols[1].classes().includes('ant-col-18')).toBe(true)
  })
})
