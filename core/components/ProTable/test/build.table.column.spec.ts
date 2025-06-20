import { mount } from '@vue/test-utils'
import antdv, {
  Button,
  DatePicker,
  Input,
  InputNumber,
  Select,
} from 'ant-design-vue'
import { describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { ProForm, ProFormItem } from '../../ProForm'
import { buildTable } from '../buildTable'
import { ProTable } from '../ProTable'

import type { ValueType } from '../../common'
import type {
  RenderBodyCellTextParams,
  RenderHeaderCellTextParams,
} from '../interface'

describe('Build Pro Table Columns', () => {
  test('column renderCell', async () => {
    type Person = {
      name: string
      age: number
    }

    const renderNameCellFn = vi.fn((ctx: RenderBodyCellTextParams<Person>) =>
      h('div', { class: 'name-cell' }, `姓名是${ctx.record.name}`)
    )
    const renderNameCell = ref()

    const defaultData = { name: 'IconMan', age: 24 }

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
                renderCell: renderNameCell,
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            data: [defaultData],
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'render-button',
              onClick() {
                renderNameCell.value = renderNameCellFn
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

    expect(wrapper.findAllComponents(ProTable).length).toBe(1)
    expect(wrapper.findAll('.ant-table-tbody tr td').length).toBe(2)
    expect(wrapper.findAll('.ant-table-tbody tr td')[0].text()).toBe('IconMan')
    expect(wrapper.findAll('.ant-table-tbody tr td')[1].text()).toBe('24')

    const button = wrapper.find('.render-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(wrapper.findAll('.ant-table-tbody tr td').length).toBe(2)
    expect(wrapper.findAll('.ant-table-tbody tr td')[1].text()).toBe('24')
    expect(wrapper.findAll('.name-cell').length).toBe(1)
    expect(wrapper.findAll('.name-cell')[0].text()).toBe(`姓名是IconMan`)
    expect(renderNameCellFn).toHaveBeenCalledTimes(1)
  })

  test('column renderHeader', async () => {
    type Person = {
      name: string
      age: number
    }

    const renderNameHeaderCellFn = vi.fn(
      (ctx: RenderHeaderCellTextParams<Person>) =>
        h('div', { class: 'name-header-cell' }, `{${ctx.title}}`)
    )
    const renderNameHeaderCell = ref()

    const defaultData = { name: 'IconMan', age: 24 }

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
                renderHeader: renderNameHeaderCell,
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            data: [defaultData],
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'render-button',
              onClick() {
                renderNameHeaderCell.value = renderNameHeaderCellFn
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

    expect(wrapper.findAllComponents(ProTable).length).toBe(1)
    expect(wrapper.findAll('.ant-table-thead tr th').length).toBe(2)
    expect(wrapper.findAll('.ant-table-thead tr th')[0].text()).toBe('姓名')
    expect(wrapper.findAll('.ant-table-thead tr th')[1].text()).toBe('年龄')
    expect(renderNameHeaderCellFn).toHaveBeenCalledTimes(0)

    const button = wrapper.find('.render-button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(wrapper.findAll('.ant-table-thead tr th').length).toBe(2)
    expect(wrapper.findAll('.ant-table-thead tr th')[1].text()).toBe('年龄')
    expect(wrapper.findAll('.name-header-cell').length).toBe(1)
    expect(wrapper.findAll('.name-header-cell')[0].text()).toBe('{姓名}')
    expect(renderNameHeaderCellFn).toHaveBeenCalledTimes(1)
  })

  test('column dynamic visible', async () => {
    type Person = {
      name: string
      age: number
    }

    const list: Person[] = [
      { name: 'IconMan', age: 24 },
      { name: 'Nicholas', age: 25 },
    ]

    const App = defineComponent({
      name: 'App',
      setup() {
        const nameVisible = ref(true)
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
                show: nameVisible,
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            data: list,
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'toggle-button',
              onClick() {
                nameVisible.value = !nameVisible.value
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

    expect(wrapper.findAllComponents(ProTable).length).toBe(1)
    expect(wrapper.findAll('.ant-table-tbody tr').length).toBe(2)
    expect(wrapper.findAll('.ant-table-tbody tr')[0].findAll('td').length).toBe(
      2
    )
    expect(wrapper.findAll('.ant-table-tbody tr')[1].findAll('td').length).toBe(
      2
    )

    const toggleButton = wrapper.find('.toggle-button')
    expect(toggleButton.exists()).toBe(true)

    await toggleButton.trigger('click')

    expect(wrapper.findAll('.ant-table-tbody tr').length).toBe(2)
    expect(wrapper.findAll('.ant-table-tbody tr')[0].findAll('td').length).toBe(
      1
    )
    expect(wrapper.findAll('.ant-table-tbody tr')[1].findAll('td').length).toBe(
      1
    )
  })

  test('column dynamic label', async () => {
    type Person = {
      name: string
      age: number
    }

    const list: Person[] = [
      { name: 'IconMan', age: 24 },
      { name: 'Nicholas', age: 25 },
    ]

    const App = defineComponent({
      name: 'App',
      setup() {
        const nameLabel = ref('姓名')
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: nameLabel,
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
              },
            ],
            data: list,
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'toggle-button',
              onClick() {
                nameLabel.value = `${nameLabel.value}${nameLabel.value}`
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

    expect(wrapper.findAll('.ant-table-thead th').length).toBe(2)
    expect(wrapper.findAll('.ant-table-thead th')[0].text()).toBe('姓名')

    const toggleButton = wrapper.find('.toggle-button')
    expect(toggleButton.exists()).toBe(true)

    await toggleButton.trigger('click')

    expect(wrapper.findAll('.ant-table-thead th')[0].text()).toBe('姓名姓名')
  })

  test('column dynamic type', async () => {
    type Person = {
      name: string
      age: number
    }

    const list: Person[] = [
      { name: 'IconMan', age: 24 },
      { name: 'Nicholas', age: 25 },
    ]

    const App = defineComponent({
      name: 'App',
      setup() {
        const nameType = ref<ValueType>('text')
        // @ts-ignore
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
                type: nameType,
                search: { type: 'digit' },
              },
              {
                label: '年龄',
                name: 'age',
                type: 'digit',
              },
            ],
            data: list,
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'toggle-button',
              onClick() {
                nameType.value = 'date'
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

    expect(wrapper.findAllComponents(ProForm).length).toBe(1)
    expect(wrapper.findAllComponents(ProFormItem).length).toBe(2)
    expect(
      wrapper.findAllComponents(ProFormItem)[0].findAllComponents(Input).length
    ).toBe(1)
    expect(
      wrapper.findAllComponents(ProFormItem)[1].findAllComponents(InputNumber)
        .length
    ).toBe(1)

    const toggleButton = wrapper.find('.toggle-button')
    expect(toggleButton.exists()).toBe(true)

    await toggleButton.trigger('click')

    expect(
      wrapper.findAllComponents(ProFormItem)[0].findAllComponents(Input).length
    ).toBe(0)
    expect(
      wrapper.findAllComponents(ProFormItem)[0].findAllComponents(DatePicker)
        .length
    ).toBe(1)
    expect(
      wrapper.findAllComponents(ProFormItem)[1].findAllComponents(InputNumber)
        .length
    ).toBe(1)
  })

  test('action column toggle visible', async () => {
    type Person = {
      name: string
      age: number
    }

    const list: Person[] = [
      { name: 'IconMan', age: 24 },
      { name: 'Nicholas', age: 25 },
    ]

    const App = defineComponent({
      name: 'App',
      setup() {
        const actionColumnShow = ref(false)
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
                type: 'digit',
              },
            ],
            data: list,
            actionColumn: {
              show: actionColumnShow,
            },
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'toggle-button',
              onClick() {
                actionColumnShow.value = !actionColumnShow.value
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

    expect(wrapper.findAll('.ant-table-thead tr th').length).toBe(2)
    expect(wrapper.findAll('.ant-table-thead tr th')[0].text()).toBe('姓名')
    expect(wrapper.findAll('.ant-table-thead tr th')[1].text()).toBe('年龄')

    const toggleButton = wrapper.find('.toggle-button')
    expect(toggleButton.exists()).toBe(true)

    await toggleButton.trigger('click')

    expect(wrapper.findAll('.ant-table-thead tr th').length).toBe(3)
    expect(wrapper.findAll('.ant-table-thead tr th')[0].text()).toBe('姓名')
    expect(wrapper.findAll('.ant-table-thead tr th')[1].text()).toBe('年龄')
    expect(wrapper.findAll('.ant-table-thead tr th')[2].text()).toBe('操作')
  })

  test('action column dynamic add', async () => {
    type Person = {
      name: string
      age: number
    }

    const list: Person[] = [
      { name: 'IconMan', age: 24 },
      { name: 'Nicholas', age: 25 },
    ]

    const App = defineComponent({
      name: 'App',
      setup() {
        const actions = ref<any>({
          edit: { show: true, text: '编辑' },
          delete: { show: true, text: '删除' },
        })
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
                type: 'digit',
              },
            ],
            data: list,
            actionColumn: {
              show: true,
              action: {
                actions,
              },
            },
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'toggle-button',
              onClick() {
                actions.value = {
                  ...actions.value,
                  view: { show: true, text: '详情' },
                }
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

    expect(wrapper.findAll('.ant-table-thead tr th').length).toBe(3)
    expect(wrapper.findAll('.ant-table-thead tr th')[0].text()).toBe('姓名')
    expect(wrapper.findAll('.ant-table-thead tr th')[1].text()).toBe('年龄')
    expect(wrapper.findAll('.ant-table-thead tr th')[2].text()).toBe('操作')

    expect(wrapper.findAll('.ant-table-tbody tr')[0].findAll('td').length).toBe(
      3
    )
    expect(
      wrapper
        .findAll('.ant-table-tbody tr')[0]
        .findAll('td')[2]
        .findAllComponents(Button).length
    ).toBe(2)

    const toggleButton = wrapper.find('.toggle-button')
    expect(toggleButton.exists()).toBe(true)

    await toggleButton.trigger('click')

    expect(
      wrapper
        .findAll('.ant-table-tbody tr')[0]
        .findAll('td')[2]
        .findAllComponents(Button).length
    ).toBe(3)
  })

  test('action column render', async () => {
    type Person = {
      name: string
      age: number
    }

    const list: Person[] = [
      { name: 'IconMan', age: 1 },
      { name: 'Nicholas', age: 2 },
    ]

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable<Person>(() => {
          return {
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
            data: list,
            actionColumn: {
              show: true,
              action: {
                actions: {
                  add: {
                    render: ctx =>
                      h(
                        'button',
                        { class: 'add-button' },
                        `新增${ctx.record.name}`
                      ),
                  },
                  edit: {
                    text: '编辑',
                    props: {
                      danger: true,
                    },
                  },
                },
              },
            },
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'toggle-button',
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

    expect(wrapper.find('.add-button').exists()).toBe(true)
  })

  test('dictionary only called once', async () => {
    type Person = {
      name: string
      age: number
    }

    const list: Person[] = [
      { name: 'IconMan', age: 24 },
      { name: 'Nicholas', age: 25 },
    ]

    const options = [
      { label: '1岁', value: 1 },
      { label: '2岁', value: 2 },
    ]

    const fetchDictionary = vi.fn(() => options)

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable<Person>(() => {
          return {
            columns: [
              {
                label: '年龄',
                name: 'age',
                type: 'select',
                dict: {
                  fetchDictionary,
                },
              },
            ],
            data: list,
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'toggle-button',
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

    await nextTick()

    expect(fetchDictionary).toHaveBeenCalledTimes(1)
    expect(
      wrapper.findComponent(ProForm).findComponent(Select).vm.$props.options
    ).toMatchObject(options)
  })

  // TODO:
  // test('dictionary render tag in table', async () => {
  //   type Person = {
  //     name: string
  //     age: number
  //   }

  //   const list: Person[] = [
  //     { name: 'IconMan', age: 1 },
  //     { name: 'Nicholas', age: 2 },
  //   ]

  //   const options = [
  //     { label: '1岁', value: 1 },
  //     { label: '2岁', value: 2 },
  //   ]

  //   const fetchDictionary = vi.fn(() => options)

  //   const App = defineComponent({
  //     name: 'App',
  //     setup() {
  //       const { proTableBinding } = buildTable<Person>(() => {
  //         return {
  //           columns: [
  //             {
  //               label: '年龄',
  //               name: 'age',
  //               type: 'select',
  //               dict: {
  //                 fetchDictionary,
  //               },
  //             },
  //           ],
  //           data: list,
  //         }
  //       })
  //       return () => {
  //         return [
  //           h(ProTable, proTableBinding),
  //           h('button', {
  //             class: 'toggle-button',
  //           }),
  //         ]
  //       }
  //     },
  //   })

  //   const wrapper = mount(App, {
  //     global: {
  //       plugins: [antdv],
  //     },
  //   })

  //   expect(wrapper.findAllComponents(Tag).length).toBe(2)
  //   expect(wrapper.findAllComponents(Tag)[0].text()).toBe('1岁')
  //   expect(wrapper.findAllComponents(Tag)[1].text()).toBe('2岁')
  // })
})
