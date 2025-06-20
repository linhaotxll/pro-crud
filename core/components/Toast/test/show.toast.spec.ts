import { mount } from '@vue/test-utils'
import antdv, { Button, message, notification } from 'ant-design-vue'
import { describe, test, afterEach, expect } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import { buildButtonGroup, ProButtonGroup } from '../../ProButton'
import { buildSearch, ProForm } from '../../ProForm'
import { mergeToastOptions } from '../toast'

import type { ToastOptions } from '../interface'

const sleep = (time: number) => new Promise(r => setTimeout(r, time))

describe('show toast', () => {
  afterEach(() => {
    message.destroy()
  })

  test('merge toast option', async () => {
    const commonOption: ToastOptions = {
      info: {
        content: 'info content',
        duration: 1000,
        key: 'info',
        type: 'success',
      },
      success: 'success content',
      error: ['1', '2'],
      config: { duration: 5000, icon: 'icon', key: 'abc' },
    }

    const infoResult = mergeToastOptions(commonOption, 'info')
    const successResult = mergeToastOptions(commonOption, 'success')
    const errorResult = mergeToastOptions(commonOption, 'error')

    expect(infoResult).toMatchInlineSnapshot(`
      {
        "content": "info content",
        "duration": 1000,
        "icon": "icon",
        "key": "info",
        "type": "info",
      }
    `)
    expect(successResult).toMatchInlineSnapshot(`
      {
        "content": "success content",
        "duration": 5000,
        "icon": "icon",
        "key": "abc",
        "type": "success",
      }
    `)
    expect(errorResult).toMatchInlineSnapshot(`
      {
        "content": [
          "1",
          "2",
        ],
        "duration": 5000,
        "icon": "icon",
        "key": "abc",
        "type": "error",
      }
    `)
  })

  test('pro button default no toast', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const buttonGroup = buildButtonGroup({
          actions: {
            confirm: {
              text: '确认',
              props: {
                async onClick() {
                  await sleep(1000)
                },
              },
            },
          },
        })

        return () => {
          return h(ProButtonGroup, { action: buttonGroup })
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
      attachTo: 'body',
    })

    await expect(wrapper.findComponent(Button).vm.$emit('click'))
    await nextTick()
    await sleep(1000)

    expect(!!document.querySelector('.ant-message')).toBe(false)
  })

  test('pro button toast', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const buttonGroup = buildButtonGroup({
          actions: {
            confirm: {
              toast: {
                loading: { content: '加载中' },
                success: { content: '成功', duration: 0.5 },
              },
              props: {
                async onClick() {
                  await sleep(1000)
                },
              },
            },
          },
        })

        return () => {
          return h(ProButtonGroup, { action: buttonGroup })
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
      attachTo: 'body',
    })

    await wrapper.findAllComponents(Button)[0].vm.$emit('click')
    await nextTick()

    expect(!!document.querySelector('.ant-message-loading')).toBe(true)

    await sleep(1000)
    expect(!!document.querySelector('.ant-message-loading')).toBe(false)
    expect(!!document.querySelector('.ant-message-success')).toBe(true)

    await sleep(500)
    expect(!!document.querySelector('.ant-message-success')).toBe(false)
  })

  test('pro button custom toast', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const buttonGroup = buildButtonGroup({
          actions: {
            confirm: {
              toast: {
                loading: {
                  show() {
                    notification.info({ message: '加载总', duration: 2 })
                  },
                },
                success: {
                  show() {
                    notification.success({ message: '成功', duration: 1 })
                  },
                },
              },
              props: {
                async onClick() {
                  await sleep(1000)
                },
              },
            },
          },
        })

        return () => {
          return h(ProButtonGroup, { action: buttonGroup })
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
      attachTo: 'body',
    })

    await wrapper.findAllComponents(Button)[0].vm.$emit('click')
    await nextTick()

    expect(!!document.querySelector('.ant-notification-notice-icon-info')).toBe(
      true
    )

    await sleep(1000)
    expect(!!document.querySelector('.ant-notification-notice-icon-info')).toBe(
      true
    )
    expect(
      !!document.querySelector('.ant-notification-notice-icon-success')
    ).toBe(true)

    await sleep(1100)
    expect(!!document.querySelector('.ant-notification-notice-icon-info')).toBe(
      false
    )
    expect(
      !!document.querySelector('.ant-notification-notice-icon-success')
    ).toBe(false)
  })

  // test('pro form submit has toast', async () => {
  //   const App = defineComponent({
  //     name: 'App',
  //     setup() {
  //       const { proFormBinding } = buildForm(() => {
  //         return {
  //           columns: [
  //             {
  //               label: '名称',
  //               name: 'name',
  //             },
  //           ],

  //           async submitRequest() {
  //             await sleep(500)
  //             return true
  //           },
  //         }
  //       })

  //       return () => {
  //         return h(ProForm, proFormBinding)
  //       }
  //     },
  //   })

  //   const wrapper = mount(App, {
  //     global: {
  //       plugins: [antdv],
  //     },
  //     attachTo: 'body',
  //   })

  //   await wrapper.findComponent(Button).vm.$emit('click')
  //   await nextTick()

  //   expect(!!document.querySelector('.ant-message-loading')).toBe(true)

  //   await sleep(550)
  //   expect(!!document.querySelector('.ant-message-loading')).toBe(false)
  //   expect(!!document.querySelector('.ant-message-success')).toBe(true)
  // })

  test('pro search submit has not toast', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildSearch(() => {
          return {
            columns: [
              {
                label: '名称',
                name: 'name',
              },
            ],

            async submitRequest() {
              await sleep(500)
              return true
            },
          }
        })

        return () => {
          return h(ProForm, proFormBinding)
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
      attachTo: 'body',
    })

    await wrapper.findComponent(Button).vm.$emit('click')
    await nextTick()

    expect(!!document.querySelector('.ant-message-loading')).toBe(false)
    expect(!!document.querySelector('.ant-message-success')).toBe(false)

    await sleep(550)
    expect(!!document.querySelector('.ant-message-loading')).toBe(false)
    expect(!!document.querySelector('.ant-message-success')).toBe(false)
  })
})
