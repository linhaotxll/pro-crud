import { mount } from '@vue/test-utils'
import antdv, { Button, Space } from 'ant-design-vue'
import { describe, test, expect, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { ProForm, ProFormItem, ProFormList, buildForm } from '..'
import { ProComponents } from '../../../index'

import type { ProFormScope } from '..'

describe('Pro Form Scope', () => {
  test('column.list has columns can render ProFormList', async () => {
    // no list
    const { proFormBinding: proFormBinding1 } = buildForm(() => {
      return {
        columns: [{ label: '列表', name: 'list', type: 'list' }],
      }
    })

    const wrapper1 = mount(ProForm, {
      props: proFormBinding1,
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper1.findComponent(ProFormList).exists()).toBe(false)

    // no children
    const { proFormBinding: proFormBinding2 } = buildForm(() => {
      return {
        columns: [{ label: '列表', name: 'list', type: 'list', list: {} }],
      }
    })

    const wrapper2 = mount(ProForm, {
      props: proFormBinding2,
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper2.findComponent(ProFormList).exists()).toBe(false)

    // children is empty
    const { proFormBinding: proFormBinding4 } = buildForm(() => {
      return {
        columns: [
          { label: '列表', name: 'list', type: 'list', list: { children: [] } },
        ],
      }
    })

    const wrapper4 = mount(ProForm, {
      props: proFormBinding4,
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper4.findComponent(ProFormList).exists()).toBe(false)

    // has list
    const { proFormBinding: proFormBinding3 } = buildForm(() => {
      return {
        columns: [
          {
            label: '列表',
            name: 'list',
            type: 'list',
            list: { children: [{ label: '用户名', name: 'username' }] },
          },
        ],
      }
    })

    const wrapper3 = mount(ProForm, {
      props: proFormBinding3,
      global: {
        plugins: [antdv, ProComponents],
      },
    })

    expect(wrapper3.findComponent(ProFormList).exists()).toBe(true)
    expect(
      wrapper3
        .findComponent(Space)
        .find('div')
        .classes()
        .includes('ant-space-align-center')
    ).toBe(true)
  })

  test('column.list is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const list = ref<any>({
          children: [{ label: '用户名', name: 'username' }],
        })
        const { proFormBinding } = buildForm(() => {
          return {
            columns: [{ label: '列表', name: 'list', type: 'list', list }],
          }
        })

        return () => {
          return [
            h(ProForm, proFormBinding),
            h('button', {
              class: 'clear-button',
              onClick() {
                list.value = null
              },
            }),
            h('button', {
              class: 'set-button',
              onClick() {
                list.value = {
                  children: [
                    { label: '昵称', name: 'nickname' },
                    { label: '密码', name: 'pwd' },
                  ],
                }
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv, ProComponents],
      },
    })

    expect(wrapper.findComponent(ProFormList).exists()).toBe(true)

    const clearButton = wrapper.find('.clear-button')
    expect(clearButton.exists()).toBe(true)

    await clearButton.trigger('click')

    expect(wrapper.findComponent(ProFormList).exists()).toBe(true)
    expect(wrapper.findComponent(ProFormList).findAll('div').length).toBe(0)

    const setButton = wrapper.find('.set-button')
    expect(setButton.exists()).toBe(true)

    await setButton.trigger('click')

    expect(
      wrapper.findComponent(ProFormList).findAllComponents(Button).length
    ).toBe(1)

    await wrapper
      .findComponent(ProFormList)
      .findComponent(Button)
      .vm.$emit('click')

    expect(
      wrapper.findComponent(ProFormList).findAllComponents(ProFormItem).length
    ).toBe(2)
    expect(
      wrapper
        .findComponent(ProFormList)
        .findAllComponents(ProFormItem)[0]
        .find('label')
        ?.text()
    ).toBe('昵称')
    expect(
      wrapper
        .findComponent(ProFormList)
        .findAllComponents(ProFormItem)[1]
        .find('label')
        ?.text()
    ).toBe('密码')
  })

  test('column.list.children is ref', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const children = ref<any>([{ label: '用户名', name: 'username' }])
        const { proFormBinding } = buildForm(() => {
          return {
            columns: [
              { label: '列表', name: 'list', type: 'list', list: { children } },
            ],
          }
        })

        return () => {
          return [
            h(ProForm, proFormBinding),
            h('button', {
              class: 'clear-button',
              onClick() {
                children.value = []
              },
            }),
            h('button', {
              class: 'set-button',
              onClick() {
                children.value = [
                  { label: '昵称', name: 'nickname' },
                  { label: '密码', name: 'pwd' },
                ]
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv, ProComponents],
      },
    })

    expect(wrapper.findComponent(ProFormList).exists()).toBe(true)

    const clearButton = wrapper.find('.clear-button')
    expect(clearButton.exists()).toBe(true)

    await clearButton.trigger('click')

    expect(wrapper.findComponent(ProFormList).exists()).toBe(true)
    expect(wrapper.findComponent(ProFormList).findAll('div').length).toBe(0)

    const setButton = wrapper.find('.set-button')
    expect(setButton.exists()).toBe(true)

    await setButton.trigger('click')

    expect(
      wrapper.findComponent(ProFormList).findAllComponents(Button).length
    ).toBe(1)

    await wrapper
      .findComponent(ProFormList)
      .findComponent(Button)
      .vm.$emit('click')

    expect(
      wrapper.findComponent(ProFormList).findAllComponents(ProFormItem).length
    ).toBe(2)
    expect(
      wrapper
        .findComponent(ProFormList)
        .findAllComponents(ProFormItem)[0]
        .find('label')
        ?.text()
    ).toBe('昵称')
    expect(
      wrapper
        .findComponent(ProFormList)
        .findAllComponents(ProFormItem)[1]
        .find('label')
        ?.text()
    ).toBe('密码')
  })

  test('add, copy, delete', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const children = ref<any>([{ label: '用户名', name: 'username' }])
        const { proFormBinding } = buildForm(() => {
          return {
            columns: [
              {
                label: '列表',
                name: 'list',
                type: 'list',
                list: { children, max: 3, min: 2 },
              },
            ],
          }
        })

        return () => {
          return [
            h(ProForm, proFormBinding),
            h('button', {
              class: 'clear-button',
              onClick() {
                children.value = []
              },
            }),
            h('button', {
              class: 'set-button',
              onClick() {
                children.value = [
                  { label: '昵称', name: 'nickname' },
                  { label: '密码', name: 'pwd' },
                ]
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv, ProComponents],
      },
    })

    expect(wrapper.findComponent(ProFormList).exists()).toBe(true)

    // 新增按钮
    const createButton = wrapper
      .findComponent(ProFormList)
      .findComponent(Button)

    expect(createButton.exists()).toBe(true)

    // 新增一行
    await createButton.vm.$emit('click')

    expect(
      wrapper.findComponent(ProFormList).findAllComponents(ProFormItem).length
    ).toBe(1)

    // 新增一行
    await createButton.vm.$emit('click')

    expect(
      wrapper.findComponent(ProFormList).findAllComponents(ProFormItem).length
    ).toBe(2)

    // 拷贝一行
    await wrapper
      .findComponent(ProFormList)
      .findAllComponents(Space)[0]
      .findAllComponents(Button)[0]
      .vm.$emit('click')

    expect(
      wrapper.findComponent(ProFormList).findAllComponents(ProFormItem).length
    ).toBe(3)

    // 拷贝一行，失效
    await wrapper
      .findComponent(ProFormList)
      .findAllComponents(Space)[0]
      .findAllComponents(Button)[0]
      .vm.$emit('click')

    expect(
      wrapper.findComponent(ProFormList).findAllComponents(ProFormItem).length
    ).toBe(3)

    // 删除一行
    await wrapper
      .findComponent(ProFormList)
      .findAllComponents(Space)[0]
      .findAllComponents(Button)[1]
      .vm.$emit('click')

    expect(
      wrapper.findComponent(ProFormList).findAllComponents(ProFormItem).length
    ).toBe(2)

    // 删除一行
    await wrapper
      .findComponent(ProFormList)
      .findAllComponents(Space)[0]
      .findAllComponents(Button)[1]
      .vm.$emit('click')

    expect(
      wrapper.findComponent(ProFormList).findAllComponents(ProFormItem).length
    ).toBe(2)
  })

  test('value is valid', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const children = ref<any>([
          { label: '用户名', name: 'username' },
          { label: '密码', name: 'password' },
        ])

        const { proFormBinding } = buildForm(() => {
          return {
            initialValues: {
              list: [{ username: 'admin', password: 'admin123' }],
            },
            columns: [
              { label: '列表', name: 'list', type: 'list', list: { children } },
            ],
          }
        })

        return () => {
          return [h(ProForm, proFormBinding)]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv, ProComponents],
      },
    })

    const list = wrapper.findComponent(ProFormList)

    expect(list.exists()).toBe(true)
    expect(list.findAll('input').length).toBe(2)
    expect(list.findAll('input')[0].element.value).toBe('admin')
    expect(list.findAll('input')[1].element.value).toBe('admin123')

    expect(list.find('.ant-btn-dashed').exists()).toBe(true)
    await list.find('.ant-btn-dashed').trigger('click')

    expect(list.findAll('input').length).toBe(4)
    expect(list.findAll('input')[0].element.value).toBe('admin')
    expect(list.findAll('input')[1].element.value).toBe('admin123')
    expect(list.findAll('input')[2].element.value).toBe('')
    expect(list.findAll('input')[3].element.value).toBe('')
  })

  test('add, copy, delete do not show', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const children = ref<any>([
          { label: '用户名', name: 'username' },
          { label: '密码', name: 'password' },
        ])
        const creatorButtonProps = ref({})
        const copyButtonProps = ref({})
        const deleteButtonProps = ref({})

        const { proFormBinding } = buildForm(() => {
          return {
            initialValues: {
              list: [{ username: 'admin', password: 'admin123' }],
            },
            columns: [
              {
                label: '列表',
                name: 'list',
                type: 'list',
                list: {
                  children,
                  creatorButtonProps,
                  copyButtonProps,
                  deleteButtonProps,
                },
              },
            ],
          }
        })

        return () => {
          return [
            h(ProForm, proFormBinding),
            h('button', {
              class: 'create-button',
              onClick() {
                creatorButtonProps.value =
                  creatorButtonProps.value === false ? {} : false
              },
            }),
            h('button', {
              class: 'copy-button',
              onClick() {
                copyButtonProps.value =
                  copyButtonProps.value === false ? {} : false
              },
            }),
            h('button', {
              class: 'delete-button',
              onClick() {
                deleteButtonProps.value =
                  deleteButtonProps.value === false ? {} : false
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv, ProComponents],
      },
    })

    expect(wrapper.findComponent(ProFormList).exists()).toBe(true)
    expect(
      wrapper.findComponent(ProFormList).findAllComponents(Button).length
    ).toBe(3)

    await wrapper.find('.create-button').trigger('click')
    expect(
      wrapper.findComponent(ProFormList).findAllComponents(Button).length
    ).toBe(2)

    await wrapper.find('.create-button').trigger('click')
    expect(
      wrapper.findComponent(ProFormList).findAllComponents(Button).length
    ).toBe(3)

    await wrapper.find('.copy-button').trigger('click')
    expect(
      wrapper.findComponent(ProFormList).findAllComponents(Button).length
    ).toBe(2)

    await wrapper.find('.copy-button').trigger('click')
    expect(
      wrapper.findComponent(ProFormList).findAllComponents(Button).length
    ).toBe(3)

    await wrapper.find('.delete-button').trigger('click')
    expect(
      wrapper.findComponent(ProFormList).findAllComponents(Button).length
    ).toBe(2)

    await wrapper.find('.delete-button').trigger('click')
    expect(
      wrapper.findComponent(ProFormList).findAllComponents(Button).length
    ).toBe(3)
  })

  test('add with creatorRecord', async () => {
    const timestamp = `${Date.now()}`
    const App = defineComponent({
      name: 'App',
      setup() {
        const children = ref<any>([{ label: '用户名', name: 'username' }])
        const { proFormBinding } = buildForm(() => {
          return {
            columns: [
              {
                label: '列表',
                name: 'list',
                type: 'list',
                list: {
                  children,
                  max: 3,
                  min: 2,
                  creatorRecord() {
                    return { username: timestamp }
                  },
                },
              },
            ],
          }
        })

        return () => {
          return [h(ProForm, proFormBinding)]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv, ProComponents],
      },
    })

    expect(wrapper.findComponent(ProFormList).exists()).toBe(true)

    // 新增按钮
    const createButton = wrapper
      .findComponent(ProFormList)
      .findComponent(Button)

    expect(createButton.exists()).toBe(true)

    // 新增一行
    await createButton.vm.$emit('click')

    expect(
      wrapper.findComponent(ProFormList).findAllComponents(ProFormItem).length
    ).toBe(1)

    expect(
      wrapper.findAllComponents(ProFormItem)[0].find('input').element.value
    ).toBe(timestamp)

    // 新增第二行
    await createButton.vm.$emit('click')

    expect(
      wrapper.findComponent(ProFormList).findAllComponents(ProFormItem).length
    ).toBe(2)

    expect(
      wrapper.findAllComponents(ProFormItem)[0].find('input').element.value
    ).toBe(timestamp)
    expect(
      wrapper.findAllComponents(ProFormItem)[1].find('input').element.value
    ).toBe(timestamp)
  })

  test('children has name path', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const list = ref<any>({
          children: [{ label: '用户名', name: ['username'] }],
        })
        const { proFormBinding } = buildForm(() => {
          return {
            columns: [{ label: '信息', name: ['info'], type: 'list', list }],
          }
        })

        return () => {
          return [
            h(ProForm, proFormBinding),
            h('button', {
              class: 'clear-button',
              onClick() {
                list.value = null
              },
            }),
            h('button', {
              class: 'set-button',
              onClick() {
                list.value = {
                  children: [
                    { label: '昵称', name: 'nickname' },
                    { label: '密码', name: 'pwd' },
                  ],
                }
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv, ProComponents],
      },
    })

    expect(wrapper.findComponent(ProFormList).exists()).toBe(true)

    const clearButton = wrapper.find('.clear-button')
    expect(clearButton.exists()).toBe(true)

    await clearButton.trigger('click')

    expect(wrapper.findComponent(ProFormList).exists()).toBe(true)
    expect(wrapper.findComponent(ProFormList).findAll('div').length).toBe(0)

    const setButton = wrapper.find('.set-button')
    expect(setButton.exists()).toBe(true)

    await setButton.trigger('click')

    expect(
      wrapper.findComponent(ProFormList).findAllComponents(Button).length
    ).toBe(1)

    await wrapper
      .findComponent(ProFormList)
      .findComponent(Button)
      .vm.$emit('click')

    expect(
      wrapper.findComponent(ProFormList).findAllComponents(ProFormItem).length
    ).toBe(2)
    expect(
      wrapper
        .findComponent(ProFormList)
        .findAllComponents(ProFormItem)[0]
        .find('label')
        ?.text()
    ).toBe('昵称')
    expect(
      wrapper
        .findComponent(ProFormList)
        .findAllComponents(ProFormItem)[1]
        .find('label')
        ?.text()
    ).toBe('密码')
  })

  test('pro form list submit params', async () => {
    let scope: ProFormScope

    const submitRequest = vi.fn(() => false)

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(s => {
          scope = s

          return {
            initialValues: {
              info: [
                { username: 'IconMan', age: 24 },
                { username: 'Nicholas', age: 25 },
              ],
            },
            columns: [
              {
                label: '信息',
                name: ['info'],
                type: 'list',
                list: {
                  children: [
                    {
                      label: '用户名',
                      name: ['username'],
                      transform: {
                        to(formValue) {
                          return `${formValue}-${formValue}`
                        },
                      },
                    },
                    {
                      label: '年龄',
                      name: 'age',
                      transform: {
                        to(formValue) {
                          return formValue * 2
                        },
                      },
                    },
                  ],
                },
              },
            ],
            submitRequest,
          }
        })

        return () => {
          return [h(ProForm, proFormBinding)]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv, ProComponents],
      },
    })

    expect(wrapper.findAll('input').length).toBe(4)

    await scope!.submit()

    expect(submitRequest).toHaveBeenCalledTimes(1)
    expect(submitRequest).toHaveBeenCalledWith({
      info: [
        { username: 'IconMan-IconMan', age: 48 },
        { username: 'Nicholas-Nicholas', age: 50 },
      ],
    })
  })
})
