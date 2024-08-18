import { mount } from '@vue/test-utils'
import antdv from 'ant-design-vue'
import { describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { buildCustomRender } from '../customRender'

import type { PropType } from 'vue'

describe('Custom Render', () => {
  test('render is function', () => {
    type Context = { name: string; age: number }

    const render = vi.fn((context: Context) =>
      h('div', { class: 'render-button' }, `Render Button ${context.name}`)
    )

    const context: Context = { name: 'IconMan', age: 24 }

    const App = defineComponent({
      name: 'App',
      setup() {
        return () => {
          const dom = buildCustomRender<Context>({
            render,
            context,
          })

          return dom
        }
      },
    })

    expect(render).toHaveBeenCalledTimes(0)

    const wrapper = mount(App, { global: { plugins: [antdv] } })

    expect(wrapper.find('.render-button').exists()).toBe(true)
    expect(wrapper.find('.render-button').text()).toBe(
      `Render Button ${context.name}`
    )
    expect(render).toHaveBeenCalledTimes(1)
    expect(render).toHaveBeenCalledWith(context)
  })

  test('is Component', () => {
    type Context = { name: string; age: number }

    const context: Context = { name: 'IconMan', age: 24 }

    const CustomButton = defineComponent({
      name: 'CustomButton',
      props: {
        context: {
          type: Object as PropType<Context>,
          required: true,
        },
      },
      setup(props) {
        return () => {
          return h(
            'button',
            { class: 'component-render' },
            `Component Render ${props.context.name}`
          )
        }
      },
    })

    const App = defineComponent({
      name: 'App',
      setup() {
        return () => {
          const dom = buildCustomRender<Context>({
            is: CustomButton,
            context,
          })

          return dom
        }
      },
    })

    const wrapper = mount(App, { global: { plugins: [antdv] } })

    expect(wrapper.findComponent(CustomButton).exists()).toBe(true)
    expect(wrapper.find('.component-render').text()).toBe(
      `Component Render ${context.name}`
    )
  })

  test('is string', () => {
    type Context = { name: string; age: number }

    const context: Context = { name: 'IconMan', age: 24 }

    const CustomButton = defineComponent({
      name: 'CustomButton',
      props: {
        name: String as PropType<string>,
        age: Number as PropType<number>,
      },
      setup(props) {
        return () => {
          return h(
            'button',
            { class: 'component-render' },
            `Component Render ${props.name} and ${props.age}`
          )
        }
      },
    })

    const App = defineComponent({
      name: 'App',
      setup() {
        return () => {
          const dom = buildCustomRender<Context>({
            is: 'custom-button',
            context,
          })

          return dom
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [
          antdv,
          app => {
            app.component(CustomButton.name!, CustomButton)
          },
        ],
      },
    })

    expect(wrapper.findComponent(CustomButton).exists()).toBe(true)
    expect(wrapper.find('.component-render').text()).toBe(
      `Component Render ${context.name} and ${context.age}`
    )
  })
})
