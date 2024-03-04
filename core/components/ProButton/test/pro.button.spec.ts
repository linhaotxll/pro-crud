import { mount } from '@vue/test-utils'
import { Button, Popconfirm, Space } from 'ant-design-vue'
import { describe, expect, test, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { ProButtonGroup, buildButtonGroup } from '..'

import type { ProButtonConfirmType } from '..'
import type { ModalProps, PopconfirmProps } from 'ant-design-vue'

describe('Pro Button', () => {
  test('pro button group show default true', () => {
    const buttonGroup1 = buildButtonGroup({})

    const wrapper1 = mount(ProButtonGroup, {
      props: { action: buttonGroup1 },
    })

    expect(wrapper1.findAllComponents(Space).length).toBe(0)

    const buttonGroup2 = buildButtonGroup({
      actions: {
        confirm: { text: '确认' },
      },
    })

    const wrapper2 = mount(ProButtonGroup, {
      props: { action: buttonGroup2 },
    })

    expect(wrapper2.findAllComponents(Space).length).toBe(1)

    const buttonGroup3 = buildButtonGroup({
      show: false,
      actions: {
        confirm: { text: '确认' },
      },
    })

    const wrapper3 = mount(ProButtonGroup, {
      props: { action: buttonGroup3 },
    })

    expect(wrapper3.findAllComponents(Space).length).toBe(0)
  })

  test('pro button group show is ref', async () => {
    const show = ref(false)
    const App = defineComponent({
      name: 'App',
      setup() {
        const buttonGroup = buildButtonGroup({
          show,
          actions: {
            confirm: { text: '确认' },
            cancel: { text: '取消' },
          },
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                show.value = !show.value
              },
            }),
            h(ProButtonGroup, { action: buttonGroup }),
          ])
        }
      },
    })

    const wrapper = mount(App)

    expect(wrapper.findAllComponents(Space).length).toBe(0)
    expect(wrapper.findAllComponents(Button).length).toBe(0)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    const buttons = wrapper.findAllComponents(Button)
    expect(wrapper.findAllComponents(Space).length).toBe(1)
    expect(buttons.length).toBe(2)
    expect(buttons[0].text()).toBe('确 认')
    expect(buttons[1].text()).toBe('取 消')

    await button.trigger('click')

    expect(wrapper.findAllComponents(Space).length).toBe(0)
    expect(wrapper.findAllComponents(Button).length).toBe(0)
  })

  test('pro button group space is ref', async () => {
    const space = ref({ align: 'center' })
    const App = defineComponent({
      name: 'App',
      setup() {
        const buttonGroup = buildButtonGroup({
          space,
          actions: {
            confirm: { text: '确认' },
            cancel: { text: '取消' },
          },
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                space.value.align = 'end'
              },
            }),
            h(ProButtonGroup, { action: buttonGroup }),
          ])
        }
      },
    })

    const wrapper = mount(App)

    expect(wrapper.findAllComponents(Space).length).toBe(1)
    expect(
      wrapper.find('.ant-space').classes().includes('ant-space-align-center')
    ).toBe(true)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(
      wrapper.find('.ant-space').classes().includes('ant-space-align-end')
    ).toBe(true)
  })

  test('pro button action.show and text is ref', async () => {
    const show = ref(true)
    const confirmText = ref('确认')
    const App = defineComponent({
      name: 'App',
      setup() {
        const buttonGroup = buildButtonGroup({
          actions: {
            confirm: { text: confirmText, show },
            cancel: { text: '取消' },
          },
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                show.value = !show.value
                confirmText.value = confirmText.value + confirmText.value
              },
            }),
            h(ProButtonGroup, { action: buttonGroup }),
          ])
        }
      },
    })

    const wrapper = mount(App)

    expect(wrapper.findAllComponents(Button).length).toBe(2)
    expect(wrapper.findAllComponents(Button)[0].text()).toBe('确 认')
    expect(wrapper.findAllComponents(Button)[1].text()).toBe('取 消')

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(wrapper.findAllComponents(Button).length).toBe(1)
    expect(wrapper.findAllComponents(Button)[0].text()).toBe('取 消')

    await button.trigger('click')
    expect(wrapper.findAllComponents(Button).length).toBe(2)
    expect(wrapper.findAllComponents(Button)[0].text()).toBe('确认确认确认确认')
    expect(wrapper.findAllComponents(Button)[1].text()).toBe('取 消')
  })

  test('pro button action.props is ref', async () => {
    const buttonProps = ref({ type: 'primary' })
    const type = ref('default')

    const App = defineComponent({
      name: 'App',
      setup() {
        const buttonGroup = buildButtonGroup({
          actions: {
            // @ts-ignore
            confirm: { text: '确认', props: buttonProps },
            // @ts-ignore
            cancel: { text: '取消', props: { type } },
          },
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                buttonProps.value = { type: 'default' }
                type.value = 'primary'
              },
            }),
            h(ProButtonGroup, { action: buttonGroup }),
          ])
        }
      },
    })

    const wrapper = mount(App)

    expect(wrapper.findAllComponents(Button).length).toBe(2)
    expect(
      wrapper.findAllComponents(Button)[0].classes().includes('ant-btn-primary')
    ).toBe(true)
    expect(
      wrapper.findAllComponents(Button)[1].classes().includes('ant-btn-default')
    ).toBe(true)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(
      wrapper.findAllComponents(Button)[0].classes().includes('ant-btn-default')
    ).toBe(true)
    expect(
      wrapper.findAllComponents(Button)[1].classes().includes('ant-btn-primary')
    ).toBe(true)
  })

  test('pro button action.order is ref', async () => {
    const confirmOrder = ref(2)
    const cancelOrder = ref(3)

    const App = defineComponent({
      name: 'App',
      setup() {
        const buttonGroup = buildButtonGroup({
          actions: {
            // @ts-ignore
            confirm: { text: '确认', order: confirmOrder },
            // @ts-ignore
            cancel: { text: '取消', order: cancelOrder },
          },
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                confirmOrder.value++
                cancelOrder.value--
              },
            }),
            h(ProButtonGroup, { action: buttonGroup }),
          ])
        }
      },
    })

    const wrapper = mount(App)

    expect(wrapper.findAllComponents(Button).length).toBe(2)
    expect(wrapper.findAllComponents(Button)[0].text()).toBe('确 认')
    expect(wrapper.findAllComponents(Button)[1].text()).toBe('取 消')

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(wrapper.findAllComponents(Button).length).toBe(2)
    expect(wrapper.findAllComponents(Button)[0].text()).toBe('取 消')
    expect(wrapper.findAllComponents(Button)[1].text()).toBe('确 认')
  })

  test('pro button action.render', async () => {
    const render = ref(() => h('div', { class: 'test-confirm-button' }))
    const App = defineComponent({
      name: 'App',
      setup() {
        const buttonGroup = buildButtonGroup({
          actions: {
            confirm: {
              render,
            },
          },
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                render.value = () => h('div', { class: 'test-cancel-button' })
                // confirmOrder.value++
                // cancelOrder.value--
              },
            }),
            h(ProButtonGroup, { action: buttonGroup }),
          ])
        }
      },
    })

    const wrapper = mount(App)

    expect(wrapper.find('.test-confirm-button').exists()).toBe(true)
    expect(wrapper.find('.test-cancel-button').exists()).toBe(false)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(wrapper.find('.test-confirm-button').exists()).toBe(false)
    expect(wrapper.find('.test-cancel-button').exists()).toBe(true)
  })

  test('pro button action popoverConfirm', async () => {
    const confirmClick = vi.fn()
    const onVisibleChange = vi.fn()
    const confirmType = ref<ProButtonConfirmType>(false)
    const confirmProps = ref<PopconfirmProps>({
      cancelText: '取消',
      onConfirm: confirmClick,
      onVisibleChange,
    })
    const buttonOnClick = vi.fn()

    let time = 0

    const App = defineComponent({
      name: 'App',
      setup() {
        // @ts-ignore
        const buttonGroup = buildButtonGroup({
          actions: {
            confirm: {
              text: '确认',
              confirmType,
              confirmProps,
              props: { onClick: buttonOnClick },
            },
          },
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                ++time
                if (time === 1) {
                  confirmType.value = 'popconfirm'
                }
                if (time === 2) {
                  confirmProps.value = {
                    cancelText: 'Cancel',
                    ...confirmProps.value,
                  }
                }
              },
            }),
            h(ProButtonGroup, { action: buttonGroup }),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        stubs: {
          transition: false,
        },
      },
    })

    expect(buttonOnClick).toHaveBeenCalledTimes(0)
    expect(wrapper.findComponent(Popconfirm).exists()).toBe(false)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await wrapper.findComponent(Button).vm.$emit('click')
    expect(buttonOnClick).toBeCalledTimes(1)

    expect(onVisibleChange).toHaveBeenCalledTimes(0)

    await button.trigger('click')

    expect(wrapper.findComponent(Popconfirm).exists()).toBe(true)

    expect(wrapper.findAllComponents(Button).length).toBe(1)
    await wrapper.findComponent(Button).vm.$emit('click')

    expect(buttonOnClick).toBeCalledTimes(1)
    expect(onVisibleChange).toHaveBeenCalledTimes(1)
  })

  test('pro button action popoverConfirm', async () => {
    const okClick = vi.fn()
    const onVisibleChange = vi.fn()
    const confirmType = ref<ProButtonConfirmType>(false)
    const confirmProps = ref<ModalProps>({
      cancelText: '取消',
      onOk: okClick,
    })
    const buttonOnClick = vi.fn()

    let time = 0

    const App = defineComponent({
      name: 'App',
      setup() {
        const buttonGroup = buildButtonGroup({
          actions: {
            confirm: {
              text: '确认',
              confirmType,
              confirmProps,
              props: { onClick: buttonOnClick },
            },
          },
        })

        return () => {
          return h('div', [
            h('button', {
              class: 'demo-button',
              onClick: () => {
                ++time
                if (time === 1) {
                  confirmType.value = 'modal'
                }
                if (time === 2) {
                  confirmProps.value = {
                    cancelText: 'Cancel',
                    ...confirmProps.value,
                  }
                }
              },
            }),
            h(ProButtonGroup, { action: buttonGroup }),
          ])
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        stubs: {
          transition: false,
        },
      },
    })

    expect(buttonOnClick).toHaveBeenCalledTimes(0)
    expect(wrapper.findComponent(Popconfirm).exists()).toBe(false)

    const button = wrapper.find('.demo-button')
    expect(button.exists()).toBe(true)

    await wrapper.findComponent(Button).vm.$emit('click')
    expect(buttonOnClick).toBeCalledTimes(1)

    expect(onVisibleChange).toHaveBeenCalledTimes(0)

    await button.trigger('click')

    expect(wrapper.findAllComponents(Button).length).toBe(1)
    await wrapper.findComponent(Button).vm.$emit('click')

    expect(buttonOnClick).toBeCalledTimes(1)
  })
})
