import { mount } from '@vue/test-utils'
import antdv, { CheckboxGroup, RadioGroup, Select } from 'ant-design-vue'
import { describe, test } from 'vitest'
import { expect } from 'vitest'
import { vi } from 'vitest'
import { beforeEach } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { ProForm, buildForm } from '..'

import type { ProFormScope } from '..'

function $$(className: string) {
  return document.body.querySelectorAll(className)
}

export const sleep = (timeout = 0) =>
  new Promise(resolve => setTimeout(resolve, timeout))

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
    const fetchDataFn = vi.fn(() => [
      { label: '男', value: 1 },
      { label: '女', value: 2 },
    ])
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
                  fetchDictionary: fetchDataFn,
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

  test('fetchData loading', async () => {
    const fetchDataFn = vi.fn(async () => {
      await sleep(100)
      return [
        { label: '男', value: 1 },
        { label: '女', value: 2 },
      ]
    })
    const onDropdownVisibleChange = vi.fn()
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
                fieldProps: { onDropdownVisibleChange },
                dict: {
                  fetchDictionary: fetchDataFn,
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

    expect(wrapper.findComponent(Select).vm.$props.loading).toBe(true)

    await sleep(300)

    expect(wrapper.findComponent(Select).vm.$props.loading).toBe(false)

    // 展开下拉选项
    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(0)
    wrapper
      .findAll('.ant-select-selector')[0]
      .element.dispatchEvent(new MouseEvent('mousedown'))
    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(1)

    await nextTick()

    expect($$('.ant-select-item').length).toBe(2)
  })

  test('dict has dependence', async () => {
    const fetchDataFn = vi.fn(() => [
      { label: '男', value: 1 },
      { label: '女', value: 2 },
    ])
    const onDropdownVisibleChange = vi.fn()
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(() => {
          return {
            initialValues: { status: 1 },
            columns: [
              {
                label: '状态',
                name: 'status',
                type: 'select',
                fieldProps: { onDropdownVisibleChange },
                dict: {
                  data: [
                    { label: '启用', value: 1 },
                    { label: '禁止', value: 2 },
                  ],
                },
              },
              {
                label: '性别',
                name: 'sex',
                type: 'select',
                fieldProps: { onDropdownVisibleChange },
                dict: {
                  dependences: ['status'],
                  fetchDictionary: fetchDataFn,
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

    expect(wrapper.findAllComponents(Select).length).toBe(2)

    expect(fetchDataFn).toHaveBeenCalledTimes(1)
    expect(fetchDataFn).toHaveBeenCalledWith({ status: 1 })

    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(0)

    // 展开状态下拉选项
    wrapper
      .findAll('.ant-select-selector')[0]
      .element.dispatchEvent(new MouseEvent('mousedown'))
    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(1)

    await nextTick()
    expect($$('.ant-select-item').length).toBe(2)
    expect(
      $$('.ant-select-item')[0].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('启用')
    expect(
      $$('.ant-select-item')[1].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('禁止')

    // 展开性别下拉选项
    wrapper
      .findAll('.ant-select-selector')[1]
      .element.dispatchEvent(new MouseEvent('mousedown'))
    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(2)

    await nextTick()
    expect($$('.ant-select-item').length).toBe(4)
    expect(
      $$('.ant-select-item')[0].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('启用')
    expect(
      $$('.ant-select-item')[1].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('禁止')
    expect(
      $$('.ant-select-item')[2].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('男')
    expect(
      $$('.ant-select-item')[3].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('女')

    // 点击第禁止个选项
    await $$('.ant-select-item')[1].dispatchEvent(new MouseEvent('click'))
    expect(fetchDataFn).toHaveBeenCalledTimes(2)
    expect(fetchDataFn).toHaveBeenCalledWith({ status: 2 })
  })

  test('use collection', async () => {
    const collection = {
      genders: [
        { dictLabel: '男', dictValue: 1 },
        { dictLabel: '女', dictValue: 2 },
      ],
    }
    const fetchDictionaryCollection = vi.fn(async () => collection)
    const fetchGenderDict = vi.fn(collection => collection.genders)
    const onDropdownVisibleChange = vi.fn()
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(() => {
          return {
            initialValues: { status: 1 },
            fetchDictionaryCollection,
            columns: [
              {
                label: '状态',
                name: 'status',
                type: 'select',
                fieldProps: { onDropdownVisibleChange },
                dict: {
                  data: [
                    { label: '启用', value: 1 },
                    { label: '禁止', value: 2 },
                  ],
                },
              },
              {
                label: '性别',
                name: 'sex',
                type: 'select',
                fieldProps: { onDropdownVisibleChange },
                dict: {
                  fetchDictionaryInCollection: fetchGenderDict,
                  labelField: 'dictLabel',
                  valueField: 'dictValue',
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

    expect(wrapper.findAllComponents(Select).length).toBe(2)
    expect(fetchDictionaryCollection).toHaveBeenCalledTimes(1)
    expect(fetchGenderDict).toHaveBeenCalledTimes(0)
    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(0)

    // 展开状态下拉选项
    wrapper
      .findAll('.ant-select-selector')[0]
      .element.dispatchEvent(new MouseEvent('mousedown'))
    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(1)

    await nextTick()
    expect($$('.ant-select-item').length).toBe(2)
    expect(
      $$('.ant-select-item')[0].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('启用')
    expect(
      $$('.ant-select-item')[1].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('禁止')

    await sleep()
    expect(fetchDictionaryCollection).toHaveBeenCalledTimes(1)
    expect(fetchGenderDict).toHaveBeenCalledTimes(1)
    expect(fetchGenderDict).toHaveBeenCalledWith(collection)

    // 展开性别下拉选项
    wrapper
      .findAll('.ant-select-selector')[1]
      .element.dispatchEvent(new MouseEvent('mousedown'))
    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(2)

    await nextTick()
    expect($$('.ant-select-item').length).toBe(4)
    expect(
      $$('.ant-select-item')[0].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('启用')
    expect(
      $$('.ant-select-item')[1].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('禁止')
    expect(
      $$('.ant-select-item')[2].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('男')
    expect(
      $$('.ant-select-item')[3].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('女')
  })

  test('use collection loading', async () => {
    const collection = {
      genders: [
        { dictLabel: '男', dictValue: 1 },
        { dictLabel: '女', dictValue: 2 },
      ],
    }
    const fetchDictionaryCollection = vi.fn(async () => {
      await sleep(200)
      return collection
    })
    const fetchGenderDict = vi.fn(collection => collection.genders)
    const onDropdownVisibleChange = vi.fn()
    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(() => {
          return {
            initialValues: { status: 1 },
            fetchDictionaryCollection,
            columns: [
              {
                label: '性别',
                name: 'sex',
                type: 'select',
                fieldProps: { onDropdownVisibleChange },
                dict: {
                  fetchDictionaryInCollection: fetchGenderDict,
                  labelField: 'dictLabel',
                  valueField: 'dictValue',
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

    expect(wrapper.findAllComponents(Select).length).toBe(1)
    expect(fetchDictionaryCollection).toHaveBeenCalledTimes(1)
    expect(fetchGenderDict).toHaveBeenCalledTimes(0)
    expect(onDropdownVisibleChange).toHaveBeenCalledTimes(0)

    expect(wrapper.findComponent(Select).vm.$props.loading).toBe(true)

    await sleep(300)

    expect(wrapper.findComponent(Select).vm.$props.loading).toBe(false)

    // 展开状态下拉选项
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
    expect(
      $$('.ant-select-item')[1].querySelector('.ant-select-item-option-content')
        ?.textContent
    ).toBe('女')

    expect(fetchDictionaryCollection).toHaveBeenCalledTimes(1)
    expect(fetchGenderDict).toHaveBeenCalledTimes(1)
    expect(fetchGenderDict).toHaveBeenCalledWith(collection)
  })
})
