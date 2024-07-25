import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { defineComponent, h } from 'vue'

import { ProComponents, ProCrud, buildCrud } from '../'

describe('Global Options', () => {
  test('global type', async () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proCrudBinding } = buildCrud(() => {
          return {
            columns: [
              {
                label: '姓名',
                type: 'test',
              },
            ],
          }
        })
        return () => {
          return h(ProCrud, proCrudBinding)
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [
          [
            ProComponents,
            {
              types: {
                test: {
                  form: {
                    render: () => h('div', { class: 'test-form' }),
                  },
                },
              },
            },
          ],
        ],
      },
    })

    expect(wrapper.find('.test-form').exists()).toBe(true)
  })
})
