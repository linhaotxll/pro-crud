import { mount } from '@vue/test-utils'
import {
  Button,
  Popconfirm,
  Space,
  message,
  notification,
} from 'ant-design-vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { buildButtonGroup, ProButton, ProButtonGroup } from '..'

import type { ProButtonConfirmType, ProButtonConformModalProps } from '..'
import type { PopconfirmProps } from 'ant-design-vue'
import type { ButtonType } from 'ant-design-vue/es/button'

describe('Pro Button', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    message.destroy()
    notification.destroy()
  })

  test('pro button default value', () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const buttonGroup = buildButtonGroup(
          {
            actions: {
              confirm: { text: '确认' },
              add: { text: '添加' },
            },
          },
          {
            actions: {
              cancel: { text: '取消' },
              confirm: { show: false },
            },
          }
        )

        return () => {
          return h(ProButtonGroup, { action: buttonGroup })
        }
      },
    })

    const wrapper = mount(App)

    expect(wrapper.findAllComponents(ProButtonGroup).length).toBe(1)
    expect(wrapper.findAllComponents(ProButton).length).toBe(2)
    expect(wrapper.findAllComponents(Space).length).toBe(1)
    expect(wrapper.findAllComponents(Button).length).toBe(2)
    expect(wrapper.findComponent(Button).text()).toBe('取 消')
  })

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
    const type = ref<ButtonType>('default')

    const App = defineComponent({
      name: 'App',
      setup() {
        const buttonGroup = buildButtonGroup({
          actions: {
            confirm: { text: '确认', props: buttonProps },
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
    const confirmProps = ref<ProButtonConformModalProps>({
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

  test('pro button onClick loading', async () => {
    const sleep = (time: number) => new Promise(r => setTimeout(r, time))
    const onClickWith1s = vi.fn(async () => {
      await sleep(1000)
    })
    const onClickWith2s = vi.fn(async () => {
      await sleep(2000)
    })

    const App = defineComponent({
      name: 'App',
      setup() {
        const buttonGroup = buildButtonGroup({
          actions: {
            single: {
              text: '确认',
              props: { onClick: onClickWith1s },
            },
            multiple: {
              text: '取消',
              props: { onClick: [onClickWith1s, onClickWith2s] },
            },
            popconfirm: {
              confirmType: 'popconfirm',
              confirmProps: {
                onConfirm: onClickWith1s,
              },
              text: 'popconfirm',
            },
            modal: {
              confirmType: 'modal',
              confirmProps: {
                onOk: onClickWith1s,
              },
              text: 'modal',
            },
          },
        })

        return () => {
          return h(ProButtonGroup, { action: buttonGroup })
        }
      },
    })

    const wrapper = mount(App, {
      attachTo: 'body',
      global: {
        stubs: {
          transition: false,
        },
      },
    })

    expect(wrapper.findAllComponents(Button).length).toBe(4)

    // single
    const singleButton = wrapper.findAllComponents(Button)[0]
    expect(singleButton.vm.$props.loading).toBe(false)
    await singleButton.vm.$emit('click')
    expect(singleButton.vm.$props.loading).toBe(true)
    await sleep(1000)
    expect(singleButton.vm.$props.loading).toBe(false)

    // multiple
    const multipleButton = wrapper.findAllComponents(Button)[1]
    expect(multipleButton.vm.$props.loading).toBe(false)
    await multipleButton.vm.$emit('click')
    expect(multipleButton.vm.$props.loading).toBe(true)
    await sleep(2000)
    expect(multipleButton.vm.$props.loading).toBe(false)

    // popconfirm
    const popconfirmButton = wrapper.findAllComponents(Button)[2]
    expect(popconfirmButton.text()).toBe('popconfirm')
    expect(popconfirmButton.vm.$props.loading).toBe(false)
    await popconfirmButton.vm.$emit('click')
    expect(popconfirmButton.vm.$props.loading).toBe(false)
    expect(document.querySelector('.ant-popover')).not.toBe(null)
    expect(document.querySelectorAll('.ant-popover button').length).toBe(2)
    expect(
      document.querySelectorAll('.ant-popover button')[1].querySelector('span')!
        .innerHTML
    ).toBe('OK')

    // modal
    expect(document.querySelector('.ant-modal')).toBe(null)
    const modalButton = wrapper.findAllComponents(Button)[3]
    expect(modalButton.text()).toBe('modal')
    expect(modalButton.vm.$props.loading).toBe(false)
    await modalButton.vm.$emit('click')
    expect(modalButton.vm.$props.loading).toBe(false)
    expect(document.querySelector('.ant-modal')).not.toBe(null)
    expect(
      document.querySelectorAll('.ant-modal-confirm-btns button').length
    ).toBe(2)
    expect(
      document
        .querySelectorAll('.ant-modal-confirm-btns button')[1]
        .querySelector('span')!.innerHTML
    ).toBe('OK')
    document
      .querySelectorAll('.ant-modal-confirm-btns button')[1]!
      .dispatchEvent(new MouseEvent('click'))
    await nextTick()
    expect(modalButton.vm.$props.loading).toBe(true)
  })
})
