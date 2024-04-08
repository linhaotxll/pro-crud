import { mount } from '@vue/test-utils'
import antdv, { Flex, Table } from 'ant-design-vue'
import { describe, expect, test } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { ProButtonGroup } from '../../ProButton'
import { buildTable } from '../buildTable'
import { ProTable } from '../ProTable'

describe('Build Pro Table', () => {
  test('default contain toolbar and table', () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable(() => {
          return {}
        })

        return () => {
          return h(ProTable, proTableBinding)
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findAllComponents(Flex).length).toBe(1)
    expect(wrapper.findAllComponents(Flex)[0].vm.$el.children.length).toBe(2)
    expect(wrapper.findAllComponents(ProButtonGroup).length).toBe(1)
    expect(wrapper.findAllComponents(Table).length).toBe(1)
  })

  test('toolbar dynamic show', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const show = ref(false)
        const { proTableBinding } = buildTable(() => {
          return {
            toolbar: {
              show,
            },
          }
        })

        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'toggle-show-btn',
              onClick() {
                show.value = !show.value
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
    })

    expect(wrapper.findAllComponents(Flex).length).toBe(0)
    expect(wrapper.findAllComponents(ProButtonGroup).length).toBe(0)
    expect(wrapper.findAllComponents(Table).length).toBe(1)

    const toggleButton = wrapper.find('.toggle-show-btn')
    expect(toggleButton.exists()).toBe(true)

    await toggleButton.trigger('click')

    expect(wrapper.findAllComponents(Flex).length).toBe(1)
    expect(wrapper.findAllComponents(Flex)[0].vm.$el.children.length).toBe(2)
    expect(wrapper.findAllComponents(ProButtonGroup).length).toBe(1)
    expect(wrapper.findAllComponents(Table).length).toBe(1)

    await toggleButton.trigger('click')

    expect(wrapper.findAllComponents(Flex).length).toBe(0)
    expect(wrapper.findAllComponents(ProButtonGroup).length).toBe(0)
    expect(wrapper.findAllComponents(Table).length).toBe(1)
  })
})
