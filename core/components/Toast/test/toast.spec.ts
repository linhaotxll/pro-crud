import { mount } from '@vue/test-utils'
import antdv, { message, notification } from 'ant-design-vue'
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import { showToast } from '../showToast'

const sleep = (time: number) => new Promise(r => setTimeout(r, time))

describe('toast', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    message.destroy()
    notification.destroy()
  })

  test('show toast params is string', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        return () => {
          return [
            h('button', {
              class: 'show-button',
              onClick() {
                showToast('测试成功')
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
      attachTo: 'body',
    })

    await wrapper.find('.show-button').trigger('click')

    expect(document.querySelectorAll('.ant-message-success').length).toBe(1)
    expect(
      document
        .querySelector('.ant-message-success')!
        .querySelectorAll('span')[1].innerHTML
    ).toBe('测试成功')

    await sleep(3000)

    expect(document.querySelectorAll('.ant-message-success').length).toBe(0)
  })

  test('show toast params is message object', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        return () => {
          return [
            h('button', {
              class: 'show-button',
              onClick() {
                showToast({
                  type: 'message',
                  props: {
                    content: '参数为对象',
                    duration: 2,
                    type: 'error',
                  },
                })
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
      attachTo: 'body',
    })

    await wrapper.find('.show-button').trigger('click')
    await nextTick()

    expect(document.querySelectorAll('.ant-message-error').length).toBe(1)
    expect(
      document.querySelector('.ant-message-error')!.querySelectorAll('span')[1]
        .innerHTML
    ).toBe('参数为对象')

    await sleep(2000)

    expect(document.querySelectorAll('.ant-message-error').length).toBe(0)
  })

  test('show toast params is notification object', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        return () => {
          return [
            h('button', {
              class: 'show-button',
              onClick() {
                showToast({
                  type: 'notification',
                  props: {
                    message: '参数为默认Notification对象',
                    duration: 2,
                  },
                })
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
      attachTo: 'body',
    })

    await wrapper.find('.show-button').trigger('click')
    await nextTick()

    expect(
      document.querySelectorAll('.ant-notification-notice-message').length
    ).toBe(1)
    expect(
      document
        .querySelector('.ant-notification-notice-message')!
        .innerHTML.includes('参数为默认Notification对象')
    ).toBe(true)
    expect(
      document.querySelector('.ant-notification-notice-icon-success')
    ).not.toBe(null)
  })

  test('show toast params is notification object', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        return () => {
          return [
            h('button', {
              class: 'show-button',
              onClick() {
                showToast({
                  type: 'notification',
                  props: {
                    message: '参数为Notification Error对象',
                    duration: 2,
                    type: 'error',
                  },
                })
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
      attachTo: 'body',
    })

    await wrapper.find('.show-button').trigger('click')
    await nextTick()

    expect(
      document.querySelectorAll('.ant-notification-notice-message').length
    ).toBe(1)
    expect(
      document
        .querySelector('.ant-notification-notice-message')!
        .innerHTML.includes('参数为Notification Error对象')
    ).toBe(true)
    expect(
      document.querySelector('.ant-notification-notice-icon-error')
    ).not.toBe(null)
  })

  test('custom toast', async () => {
    const customToast = vi.fn()
    const App = defineComponent({
      name: 'App',
      setup() {
        return () => {
          return [
            h('button', {
              class: 'show-button',
              onClick() {
                showToast(customToast)
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
      attachTo: 'body',
    })

    expect(customToast).toHaveBeenCalledTimes(0)

    await wrapper.find('.show-button').trigger('click')
    await nextTick()

    expect(customToast).toHaveBeenCalledTimes(1)
  })

  test('show toast params is false', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        return () => {
          return [
            h('button', {
              class: 'show-button',
              onClick() {
                showToast(false)
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
      attachTo: 'body',
    })

    await wrapper.find('.show-button').trigger('click')
    await nextTick()

    expect(
      document.querySelectorAll('.ant-notification-notice-message').length
    ).toBe(0)
    expect(document.querySelectorAll('.ant-message-success').length).toBe(0)
  })
})
