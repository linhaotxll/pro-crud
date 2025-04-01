import { mount } from '@vue/test-utils'
import antdv, {
  Button,
  Input,
  InputNumber,
  Modal,
  message,
} from 'ant-design-vue'
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { ModalForm, buildModalForm } from '../'

const sleep = (time: number) => new Promise(r => setTimeout(r, time))

describe('Modal Form', () => {
  beforeEach(() => {
    const el = document.createElement('div')
    el.id = 'modal'
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    Modal.destroyAll()
    message.destroy()
  })

  test('trigger default is button', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const { modalFormBinding } = buildModalForm(() => {
          return {}
        })
        return () => {
          return h(ModalForm, modalFormBinding)
        }
      },
    })

    const wrapper = mount(App, {
      attachTo: '#modal',
      global: { plugins: [antdv] },
    })
    const modal = wrapper.findComponent(Modal)

    expect(modal.exists()).toBe(true)

    expect(wrapper.findAllComponents(Button).length).toBe(1)
    expect(wrapper.findComponent(Button).text()).toBe('新建表单')
    expect(wrapper.findComponent(Button).vm.$props.type).toBe('primary')

    expect(modal.findAllComponents(Button).length).toBe(0)

    await wrapper.findComponent(Button).vm.$emit('click')
    await nextTick()

    expect(modal.findAllComponents(Button).length).toBe(2)
    expect(modal.findAllComponents(Button)[0].isVisible()).toBe(true)
    expect(modal.findAllComponents(Button)[0].text()).toBe('取 消')
    expect(modal.findAllComponents(Button)[1].text()).toBe('确 认')

    await modal.findAllComponents(Button)[0].vm.$emit('click')
    await nextTick()

    expect(modal.findAllComponents(Button)[0].isVisible()).toBe(false)
  })

  test('modal open is controled', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const open = ref(false)
        const { modalFormBinding } = buildModalForm(() => {
          return { modalProps: { open } }
        })
        return () => {
          return [
            h(ModalForm, modalFormBinding),
            h('button', {
              class: 'trigger-btn',
              onClick() {
                open.value = !open.value
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      attachTo: '#modal',
      global: { plugins: [antdv] },
    })
    const modal = wrapper.findComponent(Modal)

    expect(modal.exists()).toBe(true)

    expect(modal.findAllComponents(Button).length).toBe(0)

    await wrapper.find('.trigger-btn').trigger('click')
    await nextTick()

    expect(modal.findAllComponents(Button).length).toBe(2)
    expect(modal.findAllComponents(Button)[0].isVisible()).toBe(true)
    expect(modal.findAllComponents(Button)[0].text()).toBe('取 消')
    expect(modal.findAllComponents(Button)[1].text()).toBe('确 认')

    await wrapper.find('.trigger-btn').trigger('click')
    await nextTick()

    expect(modal.findAllComponents(Button)[0].isVisible()).toBe(false)
  })

  test('modal open is controled', async () => {
    const submitRequest = vi.fn(async () => {
      await sleep(200)
      return true
    })

    const App = defineComponent({
      name: 'App',
      setup() {
        const { modalFormBinding } = buildModalForm(() => {
          return {
            form: {
              columns: [
                {
                  name: 'name',
                  label: '用户名',
                },
                {
                  name: 'age',
                  label: '年龄',
                  type: 'digit',
                },
              ],
              submitRequest,
            },
          }
        })
        return () => {
          return h(ModalForm, modalFormBinding)
        }
      },
    })

    const wrapper = mount(App, {
      attachTo: '#modal',
      global: { plugins: [antdv] },
    })
    const modal = wrapper.findComponent(Modal)

    expect(modal.exists()).toBe(true)

    await wrapper.findComponent(Button).vm.$emit('click')
    await nextTick()

    expect(modal.findAllComponents(Input).length).toBe(1)
    expect(modal.findAllComponents(InputNumber).length).toBe(1)

    await modal.findComponent(Input).find('input').setValue('IconMan')
    await modal.findComponent(InputNumber).find('input').setValue('24')
    await nextTick()

    expect(modal.findComponent(Input).find('input').element.value).toBe(
      'IconMan'
    )
    expect(modal.findComponent(InputNumber).find('input').element.value).toBe(
      '24'
    )

    const submitButton = modal.findAllComponents(Button)[1]
    expect(submitButton.text()).toBe('确 认')

    await submitButton.vm.$emit('click')
    await sleep(0)

    expect(submitButton.vm.$props.loading).toBe(true)
    expect(submitRequest).toHaveBeenCalledTimes(1)
    expect(submitRequest).toHaveBeenCalledWith({ name: 'IconMan', age: 24 })

    await sleep(300)

    expect(submitButton.vm.$props.loading).toBe(false)

    expect(modal.findComponent(Input).isVisible()).toBe(false)
  })
})
