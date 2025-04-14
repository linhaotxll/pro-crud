import { mount } from '@vue/test-utils'
import antdv from 'ant-design-vue'
import { describe, expect, test } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

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
                name: 'name',
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
          antdv,
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

    await nextTick()
    // await sleep(1000)

    expect(wrapper.find('.test-form').exists()).toBe(true)
  })
})
