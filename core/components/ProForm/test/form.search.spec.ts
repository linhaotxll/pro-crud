import { flushPromises, mount } from '@vue/test-utils'
import antdv, { Button, Col, Row } from 'ant-design-vue'
import { describe, test, expect, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { ProForm, buildSearch } from '..'
import { ProButtonGroup } from '../../ProButton'

describe('Pro Search Types', () => {
  test('pro search action buttons', () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildSearch(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
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
        plugins: [antdv],
      },
      attachTo: 'body',
    })

    expect(wrapper.findComponent(ProButtonGroup).exists()).toBe(true)
    expect(wrapper.findAllComponents(Button).length).toBe(2)
    expect(wrapper.findAllComponents(Button)[0].text()).toBe('重 置')
    expect(
      wrapper.findAllComponents(Button)[0].classes().includes('ant-btn-default')
    ).toBe(true)
    expect(wrapper.findAllComponents(Button)[1].text()).toBe('提 交')
    expect(
      wrapper.findAllComponents(Button)[1].classes().includes('ant-btn-primary')
    ).toBe(true)

    const buttonCol = wrapper.findAllComponents(Col)[3]
    expect(buttonCol.exists()).toBe(true)
    expect(buttonCol.classes().includes('ant-col-4')).toBe(true)

    expect(wrapper.findAllComponents(Row).length).toBe(1)
    // expect(wrapper.findAllComponents(Row)[0].vm.$el.style.width).toBe('100%')
  })

  test('pro search action col', async () => {
    const initialNameColSpan = 2
    const initialActionColSpan = 3
    const initialActionColOffset =
      24 - initialNameColSpan - initialActionColSpan
    const App = defineComponent({
      name: 'App',
      setup() {
        const nameCol = ref({ span: initialNameColSpan })
        const actionCol = ref({ span: initialActionColSpan })

        const { proFormBinding } = buildSearch(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
                col: nameCol,
              },
            ],
            action: {
              col: actionCol,
            },
          }
        })
        return () => {
          return [
            h(ProForm, proFormBinding),
            h('button', {
              class: 'set-col-btn',
              onClick() {
                nameCol.value.span++
              },
            }),
            h('button', {
              class: 'set-action-btn',
              onClick() {
                actionCol.value.span++
              },
            }),
            h('button', {
              class: 'set-reset-btn',
              onClick() {
                actionCol.value = { span: initialActionColSpan }
                nameCol.value = { span: initialNameColSpan }
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

    expect(wrapper.findComponent(ProButtonGroup).exists()).toBe(true)

    expect(wrapper.findAllComponents(Col)[3].exists()).toBe(true)
    expect(
      wrapper
        .findAllComponents(Col)[3]
        .classes()
        .includes(`ant-col-${initialActionColSpan}`)
    ).toBe(true)
    expect(
      wrapper
        .findAllComponents(Col)[3]
        .classes()
        .includes(`ant-col-offset-${initialActionColOffset}`)
    ).toBe(true)

    const setColButton = wrapper.find('.set-col-btn')
    expect(setColButton.exists()).toBe(true)

    for (let i = 1; i <= 18; ++i) {
      await setColButton.trigger('click')
      expect(
        wrapper
          .findAllComponents(Col)[3]
          .classes()
          .includes(`ant-col-${initialActionColSpan}`)
      ).toBe(true)
      expect(
        wrapper
          .findAllComponents(Col)[3]
          .classes()
          .includes(`ant-col-offset-${initialActionColOffset - i}`)
      ).toBe(true)
    }

    const setResetButton = wrapper.find('.set-reset-btn')
    expect(setResetButton.exists()).toBe(true)

    await setResetButton.trigger('click')
    expect(
      wrapper
        .findAllComponents(Col)[3]
        .classes()
        .includes(`ant-col-${initialActionColSpan}`)
    ).toBe(true)
    expect(
      wrapper
        .findAllComponents(Col)[3]
        .classes()
        .includes(`ant-col-offset-${initialActionColOffset}`)
    ).toBe(true)

    const setActionButton = wrapper.find('.set-action-btn')
    expect(setActionButton.exists()).toBe(true)

    for (let i = 1; i <= 10; ++i) {
      await setActionButton.trigger('click')
      expect(
        wrapper
          .findAllComponents(Col)[3]
          .classes()
          .includes(`ant-col-${initialActionColSpan + i}`)
      ).toBe(true)
      expect(
        wrapper
          .findAllComponents(Col)[3]
          .classes()
          .includes(`ant-col-offset-${initialActionColOffset - i}`)
      ).toBe(true)
    }
  })

  test('pro search column dynamic show', async () => {
    const initialNameColSpan = 2
    const initialActionColSpan = 3
    const initialCommonColSpan = 6
    // const initialActionColOffset =
    //   24 - initialNameColSpan - initialActionColSpan - initialCommonColSpan
    const App = defineComponent({
      name: 'App',
      setup() {
        const nameCol = ref({ span: initialNameColSpan })
        const actionCol = ref({ span: initialActionColSpan })
        const ageShow = ref(true)

        const { proFormBinding } = buildSearch(() => {
          return {
            col: { span: initialCommonColSpan },
            columns: [
              {
                label: '姓名',
                name: 'name',
                col: nameCol,
              },
              {
                label: '年龄',
                name: 'age',
                show: ageShow,
                // col: nameCol,
              },
            ],
            action: {
              col: actionCol,
            },
          }
        })
        return () => {
          return [
            h(ProForm, proFormBinding),
            h('button', {
              class: 'set-col-btn',
              onClick() {
                nameCol.value.span++
              },
            }),
            h('button', {
              class: 'set-show-btn',
              onClick() {
                ageShow.value = !ageShow.value
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

    expect(wrapper.findAllComponents(Col).length).toBe(7)
    expect(wrapper.findComponent(ProButtonGroup).exists()).toBe(true)

    // action col
    expect(
      wrapper.findAllComponents(Col)[6].classes().includes('ant-col-3')
    ).toBe(true)
    expect(
      wrapper.findAllComponents(Col)[6].classes().includes('ant-col-offset-13')
    ).toBe(true)

    // name col
    expect(
      wrapper
        .findAllComponents(Col)[0]
        .classes()
        .includes(`ant-col-${initialNameColSpan}`)
    ).toBe(true)

    // age col
    expect(
      wrapper
        .findAllComponents(Col)[3]
        .classes()
        .includes(`ant-col-${initialCommonColSpan}`)
    ).toBe(true)

    // 修改三次 name col
    const setColButton = wrapper.find('.set-col-btn')
    expect(setColButton.exists()).toBe(true)
    let i = 1
    for (; i <= 3; ++i) {
      await setColButton.trigger('click')
      expect(
        wrapper
          .findAllComponents(Col)[0]
          .classes()
          .includes(`ant-col-${initialNameColSpan + i}`)
      ).toBe(true)
      expect(
        wrapper
          .findAllComponents(Col)[6]
          .classes()
          .includes(
            `ant-col-offset-${
              24 -
              initialNameColSpan -
              initialActionColSpan -
              initialCommonColSpan -
              i
            }`
          )
      ).toBe(true)
    }

    i--
    expect(i).toBe(3)

    // 隐藏 age col
    const setShowButton = wrapper.find('.set-show-btn')
    expect(setShowButton.exists()).toBe(true)
    await setShowButton.trigger('click')

    // age col 消失
    expect(wrapper.findAllComponents(Col).length).toBe(4)

    // name col 不变
    expect(
      wrapper
        .findAllComponents(Col)[0]
        .classes()
        .includes(`ant-col-${initialNameColSpan + i}`)
    ).toBe(true)

    // action col
    expect(
      wrapper
        .findAllComponents(Col)[3]
        .classes()
        .includes(`ant-col-${initialActionColSpan}`)
    ).toBe(true)
    expect(
      wrapper
        .findAllComponents(Col)[3]
        .classes()
        .includes(
          `ant-col-offset-${
            24 - (initialNameColSpan + i) - initialActionColSpan
          }`
        )
    ).toBe(true)

    // 显示 age col
    await setShowButton.trigger('click')

    expect(wrapper.findAllComponents(Col).length).toBe(7)

    // name col 不变
    expect(
      wrapper
        .findAllComponents(Col)[0]
        .classes()
        .includes(`ant-col-${initialNameColSpan + i}`)
    ).toBe(true)

    // age col
    expect(
      wrapper
        .findAllComponents(Col)[3]
        .classes()
        .includes(`ant-col-${initialCommonColSpan}`)
    ).toBe(true)

    // action col
    expect(
      wrapper
        .findAllComponents(Col)[6]
        .classes()
        .includes(`ant-col-${initialActionColSpan}`)
    ).toBe(true)
    expect(
      wrapper
        .findAllComponents(Col)[6]
        .classes()
        .includes(
          `ant-col-offset-${
            24 -
            (initialNameColSpan + i) -
            initialCommonColSpan -
            initialActionColSpan
          }`
        )
    ).toBe(true)
  })

  test('pro search column dynamic offset', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const nameColOffset = ref(2)
        const { proFormBinding } = buildSearch(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
                col: { span: 11, offset: nameColOffset },
              },
              {
                label: '年龄',
                name: 'age',
                col: { span: 5 },
              },
            ],
          }
        })
        return () => {
          return [
            h(ProForm, proFormBinding),
            h('button', {
              class: 'set-offset-btn',
              onClick() {
                nameColOffset.value++
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

    expect(wrapper.findComponent(ProButtonGroup).exists()).toBe(true)
    expect(wrapper.findAllComponents(Col).length).toBe(7)

    // name col
    expect(
      wrapper.findAllComponents(Col)[0].classes().includes('ant-col-11')
    ).toBe(true)
    expect(
      wrapper.findAllComponents(Col)[0].classes().includes('ant-col-offset-2')
    ).toBe(true)
    // age col
    expect(
      wrapper.findAllComponents(Col)[3].classes().includes('ant-col-5')
    ).toBe(true)
    // action col
    expect(
      wrapper.findAllComponents(Col)[6].classes().includes('ant-col-4')
    ).toBe(true)
    expect(
      wrapper.findAllComponents(Col)[6].classes().includes('ant-col-offset-2')
    ).toBe(true)

    const setOffsetSpan = wrapper.find('.set-offset-btn')
    expect(setOffsetSpan.exists()).toBe(true)

    await setOffsetSpan.trigger('click')
    expect(
      wrapper.findAllComponents(Col)[0].classes().includes('ant-col-offset-3')
    ).toBe(true)
    expect(
      wrapper.findAllComponents(Col)[6].classes().includes('ant-col-offset-1')
    ).toBe(true)

    await setOffsetSpan.trigger('click')
    expect(
      wrapper.findAllComponents(Col)[0].classes().includes('ant-col-offset-4')
    ).toBe(true)
    expect(
      wrapper
        .findAllComponents(Col)[6]
        .classes()
        .join('')
        .includes('ant-col-offset')
    ).toBe(false)

    await setOffsetSpan.trigger('click')
    expect(
      wrapper.findAllComponents(Col)[0].classes().includes('ant-col-offset-5')
    ).toBe(true)
    expect(
      wrapper.findAllComponents(Col)[6].classes().includes('ant-col-offset-20')
    ).toBe(true)
  })

  test('pro search column dynamic offset', async () => {
    const submitRequest = vi.fn(() => true)
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildSearch(() => {
          return {
            submitRequest,
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
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
        plugins: [antdv],
      },
      attachTo: 'body',
    })

    expect(submitRequest).toHaveBeenCalledTimes(0)
    expect(wrapper.findComponent(ProButtonGroup).exists()).toBe(true)
    expect(wrapper.findAllComponents(Button).length).toBe(2)

    await wrapper.findAllComponents(Button)[0].vm.$emit('click')
    await flushPromises()
    expect(submitRequest).toHaveBeenCalledTimes(1)

    await wrapper.findAllComponents(Button)[1].vm.$emit('click')
    await flushPromises()
    expect(submitRequest).toHaveBeenCalledTimes(2)
  })

  test('pro search confirm buttin is submit', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildSearch(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
            ],
            action: {
              actions: {
                confirm: {
                  text: 'ok',
                  props: { type: 'text', danger: true },
                },
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
    })

    expect(wrapper.findAllComponents(Button)[1].vm.$props.type).toBe('text')
    expect(wrapper.findAllComponents(Button)[1].vm.$props.danger).toBe(true)
    expect(wrapper.findAllComponents(Button)[1].vm.$props.htmlType).toBe(
      'submit'
    )
  })
})
