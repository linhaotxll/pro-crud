import { mount } from '@vue/test-utils'
import antdv, { Button, Col, Row } from 'ant-design-vue'
import { describe, test, expect } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { ProForm, buildForm } from '..'
import { ProButtonGroup } from '../../ProButton'

describe('Pro Search Types', () => {
  test('pro search action buttons', () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(() => {
          return {
            formProps: { layout: 'inline' },
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

        const { proFormBinding } = buildForm(() => {
          return {
            formProps: { layout: 'inline' },
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
})
