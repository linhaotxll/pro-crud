import { flushPromises, mount } from '@vue/test-utils'
import antdv, { Button, Col, Row } from 'ant-design-vue'
import { Input } from 'ant-design-vue'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { ProForm, ProFormItem, buildForm } from '../'
import { ProButtonGroup } from '../../ProButton'

describe('Pro Form Props', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

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

  test('form action has deafult confirm button', async () => {
    const { proFormBinding } = buildForm(() => {
      return {
        columns: [{ label: '用户名', name: 'username' }],
      }
    })

    const wrapper = mount(ProForm, { props: proFormBinding })

    expect(wrapper.findComponent(Button).exists()).toBe(true)
    expect(wrapper.findComponent(Button).text()).toBe('提 交')
    expect(
      wrapper.findComponent(Button).classes().includes('ant-btn-primary')
    ).toBe(true)
  })

  test('form action show is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        let time = 0
        const show = ref(false)
        const actions = ref()

        const { proFormBinding } = buildForm(() => {
          return {
            action: { show, actions },
            columns: [{ label: '用户名', name: 'username' }],
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                ++time
                if (time === 1) {
                  show.value = !show.value
                }
                if (time === 2) {
                  actions.value = {
                    cancel: { text: '取消', order: 1 },
                    reset: { text: '重置', order: 0 },
                  }
                }
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App)

    expect(wrapper.findComponent(ProButtonGroup).exists()).toBe(false)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(wrapper.findComponent(ProButtonGroup).exists()).toBe(true)
    expect(wrapper.findAllComponents(Button).length).toBe(0)

    await button.trigger('click')
    expect(wrapper.findAllComponents(Button).length).toBe(3)
    expect(wrapper.findAllComponents(Button)[0].text()).toBe('重 置')
    expect(wrapper.findAllComponents(Button)[1].text()).toBe('提 交')
    expect(wrapper.findAllComponents(Button)[2].text()).toBe('取 消')
  })

  test('from column is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        let time = 0
        const columns = ref<any>([{ label: '用户名', name: 'username' }])

        const { proFormBinding } = buildForm(() => {
          return {
            columns,
          }
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                ++time
                if (time === 1) {
                  columns.value = [
                    ...columns.value,
                    { label: '密码', name: 'password' },
                  ]
                }
                if (time === 2) {
                  columns.value = [
                    ...columns.value,
                    { label: '性别', name: 'gender' },
                  ]
                }
                if (time === 3) {
                  columns.value = undefined
                }
              },
            }),
            h(ProForm, proFormBinding),
          ])
        }
      },
    })

    const wrapper = mount(App)

    expect(wrapper.findAllComponents(ProFormItem).length).toBe(1)
    expect(wrapper.findAll('label')[0].text()).toBe('用户名')

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(wrapper.findAllComponents(ProFormItem).length).toBe(2)
    expect(wrapper.findAll('label')[0].text()).toBe('用户名')
    expect(wrapper.findAll('label')[1].text()).toBe('密码')

    await button.trigger('click')

    expect(wrapper.findAllComponents(ProFormItem).length).toBe(3)
    expect(wrapper.findAll('label')[0].text()).toBe('用户名')
    expect(wrapper.findAll('label')[1].text()).toBe('密码')
    expect(wrapper.findAll('label')[2].text()).toBe('性别')

    await button.trigger('click')
    expect(wrapper.findAllComponents(ProFormItem).length).toBe(0)
  })

  test('toast default', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(() => {
          return {
            submitRequest() {
              return true
            },
            // toast: 'ok',
            toast: {
              type: 'message',
              props: {
                type: 'error',
                content: 'error',
              },
            },
          }
        })

        return () => {
          return [h(ProForm, proFormBinding)]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
      attachTo: 'body',
    })

    expect(wrapper.findComponent(ProForm).exists()).toBe(true)
    expect(wrapper.findAllComponents(Button).length).toBe(1)

    await wrapper.findAllComponents(Button)[0].vm.$emit('click')
    await nextTick()
    await flushPromises()

    expect(document.querySelectorAll('.ant-message-error').length).toBe(1)

    expect(
      document
        .querySelectorAll('.ant-message-error')[0]
        .querySelectorAll('span')[1].innerHTML
    ).toBe('error')
  })

  test('column col is not default value', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(() => {
          return {
            columns: [{ label: '姓名', name: 'name' }],
            col: null,
          }
        })

        return () => {
          return [h(ProForm, proFormBinding)]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findComponent(ProForm).exists()).toBe(true)
    expect(wrapper.findAllComponents(ProFormItem).length).toBe(1)
    expect(
      wrapper.findComponent(ProFormItem).findAllComponents(Col)[0].props().span
    ).toBe(undefined)
  })

  test('submitRequest default return false', async () => {
    const successRequest = vi.fn()

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(() => {
          return {
            columns: [{ label: '姓名', name: 'name' }],
            successRequest,
          }
        })

        return () => {
          return [h(ProForm, proFormBinding)]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findAllComponents(ProForm).length).toBe(1)
    expect(successRequest).toHaveBeenCalledTimes(0)
    expect(wrapper.findAllComponents(Button).length).toBe(1)

    await wrapper.findComponent(Button).vm.$emit('click')
    await nextTick()

    expect(successRequest).toHaveBeenCalledTimes(0)
  })
})
