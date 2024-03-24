import { mount } from '@vue/test-utils'
import antdv, { CheckboxGroup, RadioGroup, Select } from 'ant-design-vue'
import { describe, test } from 'vitest'
import { expect } from 'vitest'
import { vi } from 'vitest'
import { beforeEach } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { ProForm, buildForm } from '..'
import { ProDictionary } from '../../ProDictionary'

import type { ProFormScope } from '..'

function $$(className: string) {
  return document.body.querySelectorAll(className)
}

describe('Pro Form Dictionary', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('no dict', () => {
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(() => {
          return {
            columns: [
              {
                label: '下拉框',
                name: 'select',
                type: 'select',
              },
              {
                label: '单选',
                name: 'radio-group',
                type: 'radio-group',
              },
              {
                label: '复选',
                name: 'checkbox-group',
                type: 'checkbox-group',
              },
            ],
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
    })

    expect(wrapper.findAllComponents(ProDictionary).length).toBe(3)
    expect(wrapper.findAllComponents(Select).length).toBe(1)
    expect(wrapper.findAllComponents(RadioGroup).length).toBe(1)
    expect(wrapper.findAllComponents(CheckboxGroup).length).toBe(1)
  })

  test('dict has data', async () => {
    const onDropdownVisibleChange = vi.fn()
    let scope: ProFormScope<any>
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(_scope => {
          scope = _scope
          return {
            columns: [
              {
                label: '下拉框',
                name: 'select',
                type: 'select',
                fieldProps: { onDropdownVisibleChange },
                dict: {
                  data: [
                    { label: '男', value: 1 },
                    { label: '女', value: 2 },
                  ],
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
        plugins: [antdv],
      },
      attachTo: 'body',
    })

    expect(wrapper.findAllComponents(ProDictionary).length).toBe(1)
    expect(wrapper.findAllComponents(Select).length).toBe(1)

    // 展开下拉选项
    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(0)
    wrapper
      .findAll('.ant-select-selector')[0]
      .element.dispatchEvent(new MouseEvent('mousedown'))
    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(1)

    await nextTick()

    // 点击第二个选项
    expect($$('.ant-select-item').length).toBe(2)
    await $$('.ant-select-item')[1].dispatchEvent(new MouseEvent('click'))

    expect(scope!.getFieldValue('select')).toBe(2)
  })

  test('dict has ref data', async () => {
    const onDropdownVisibleChange = vi.fn()
    let scope: ProFormScope<any>
    const App = defineComponent({
      name: 'App',
      setup() {
        const options = ref([
          { label: '男', value: 1 },
          { label: '女', value: 2 },
        ])
        const { proFormBinding } = buildForm(_scope => {
          scope = _scope
          return {
            columns: [
              {
                label: '下拉框',
                name: 'select',
                type: 'select',
                fieldProps: { onDropdownVisibleChange },
                dict: {
                  data: options,
                },
              },
            ],
          }
        })
        return () => {
          return [
            h(ProForm, proFormBinding),
            h('button', {
              class: 'update-btn',
              onClick() {
                options.value = [{ label: '未知', value: 0 }]
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
      sync: false,
      attachTo: 'body',
    })

    expect(wrapper.findAllComponents(ProDictionary).length).toBe(1)
    expect(wrapper.findAllComponents(Select).length).toBe(1)

    // 展开下拉选项
    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(0)
    wrapper
      .findAll('.ant-select-selector')[0]
      .element.dispatchEvent(new MouseEvent('mousedown'))
    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(1)

    await nextTick()

    expect($$('.ant-select-item').length).toBe(2)
    expect(
      $$('.ant-select-item')[0].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('男')

    // 点击第二个选项
    await $$('.ant-select-item')[1].dispatchEvent(new MouseEvent('click'))

    expect(scope!.getFieldValue('select')).toBe(2)

    const updateButton = wrapper.find('.update-btn')
    expect(updateButton).not.toBe(null)

    await updateButton.trigger('click')
  })

  test('dict has fetchData', async () => {
    const fetchDataFn = vi.fn()
    const onDropdownVisibleChange = vi.fn()
    let scope: ProFormScope<any>
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(_scope => {
          scope = _scope
          return {
            columns: [
              {
                label: '下拉框',
                name: 'select',
                type: 'select',
                fieldProps: { onDropdownVisibleChange },
                dict: {
                  async fetchDictionary() {
                    fetchDataFn()

                    return [
                      { label: '男', value: 1 },
                      { label: '女', value: 2 },
                    ]
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
        plugins: [antdv],
      },
      sync: false,
      attachTo: 'body',
    })

    expect(wrapper.findAllComponents(ProDictionary).length).toBe(1)
    expect(wrapper.findAllComponents(Select).length).toBe(1)

    // 展开下拉选项
    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(0)
    wrapper
      .findAll('.ant-select-selector')[0]
      .element.dispatchEvent(new MouseEvent('mousedown'))
    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(1)

    expect(fetchDataFn).toHaveBeenCalledTimes(1)

    await nextTick()

    expect($$('.ant-select-item').length).toBe(2)
    expect(
      $$('.ant-select-item')[0].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('男')

    // 点击第二个选项
    await $$('.ant-select-item')[1].dispatchEvent(new MouseEvent('click'))

    expect(scope!.getFieldValue('select')).toBe(2)
  })

  test('dict has dependence', async () => {
    const fetchDataFn = vi.fn()
    const onDropdownVisibleChange = vi.fn()
    let scope: ProFormScope<any>
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(_scope => {
          scope = _scope
          return {
            columns: [
              {
                label: '状态',
                name: 'status',
                type: 'select',
                dict: {
                  data: [
                    { label: '启用', value: 1 },
                    { label: '禁止', value: 2 },
                  ],
                },
              },
              {
                label: '下拉框',
                name: 'select',
                type: 'select',
                fieldProps: { onDropdownVisibleChange },
                dict: {
                  dependences: ['status'],
                  async fetchDictionary() {
                    fetchDataFn()

                    return [
                      { label: '男', value: 1 },
                      { label: '女', value: 2 },
                    ]
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
        plugins: [antdv],
      },
      sync: false,
      attachTo: 'body',
    })

    // expect(wrapper.findAllComponents(ProDictionary).length).toBe(2)
    // expect(wrapper.findAllComponents(Select).length).toBe(1)

    // // 展开下拉选项
    // expect(onDropdownVisibleChange).toHaveBeenCalledTimes(0)
    // wrapper
    //   .findAll('.ant-select-selector')[0]
    //   .element.dispatchEvent(new MouseEvent('mousedown'))
    // expect(onDropdownVisibleChange).toHaveBeenCalledTimes(1)

    // expect(fetchDataFn).toHaveBeenCalledTimes(1)

    // await nextTick()

    // expect($$('.ant-select-item').length).toBe(2)
    // expect(
    //   $$('.ant-select-item')[0].querySelector('.ant-select-item-option-content')
    //     ?.textContent
    // ).toBe('男')

    // // 点击第二个选项
    // await $$('.ant-select-item')[1].dispatchEvent(new MouseEvent('click'))

    // expect(scope!.getFieldValue('select')).toBe(2)
  })
})
