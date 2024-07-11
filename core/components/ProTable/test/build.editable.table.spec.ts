import { mount } from '@vue/test-utils'
import antdv, {
  Button,
  FormItem,
  Input,
  InputNumber,
  message,
  notification,
} from 'ant-design-vue'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { buildTable } from '../buildTable'
import { ProTable } from '../ProTable'

import type { EditableKeys, ProTableScope } from '../interface'

type Person = {
  id: number
  name: string
  age: number
}

const sleep = (time = 0) => new Promise(r => setTimeout(r, time))

describe('Build Pro Editable Table', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    message.destroy()
    notification.destroy()
  })

  test('rowKey is invalid', () => {
    const data: Person[] = [
      { id: 1, name: 'IconMan', age: 24 },
      { id: 2, name: 'Nicholas', age: 25 },
    ]

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable(() => {
          return {
            editable: {},
            actionColumn: { show: true },
            toolbar: { show: false },
            search: false,
            data,
            columns: [
              {
                label: '姓名',
                name: 'name',
                columnProps: { width: '30%' },
              },
              {
                label: '年龄',
                name: 'age',
                type: 'digit',
                editable: true,
                columnProps: { width: '30%' },
              },
            ],
          }
        })
        return () => {
          return h(ProTable, proTableBinding)
        }
      },
    })

    expect(() =>
      mount(App, {
        global: {
          plugins: [antdv],
        },
      })
    ).toThrowError(`rowKey is invalid`)
  })

  test('default contain edit button', () => {
    const data: Person[] = [
      { id: 1, name: 'IconMan', age: 24 },
      { id: 2, name: 'Nicholas', age: 25 },
    ]

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable(() => {
          return {
            editable: {},
            tableProps: {
              rowKey: 'id',
            },
            actionColumn: { show: true },
            toolbar: { show: false },
            search: false,
            data,
            columns: [
              {
                label: '姓名',
                name: 'name',
                columnProps: { width: '30%' },
              },
              {
                label: '年龄',
                name: 'age',
                type: 'digit',
                editable: true,
                columnProps: { width: '30%' },
              },
            ],
          }
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

    expect(wrapper.findAllComponents(Button).length).toBe(2)
    expect(wrapper.findAllComponents(Button)[0].text()).toBe('编 辑')
    expect(wrapper.findAllComponents(Button)[1].text()).toBe('编 辑')
  })

  test('default contain save and cancel button', async () => {
    const data: Person[] = [
      { id: 1, name: 'IconMan', age: 24 },
      { id: 2, name: 'Nicholas', age: 25 },
    ]

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable(() => {
          return {
            editable: {},
            tableProps: {
              rowKey: 'id',
            },
            actionColumn: { show: true },
            toolbar: { show: false },
            search: false,
            data,
            columns: [
              {
                label: '姓名',
                name: 'name',
                columnProps: { width: '30%' },
              },
              {
                label: '年龄',
                name: 'age',
                type: 'digit',
                editable: true,
                columnProps: { width: '30%' },
              },
            ],
          }
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

    expect(wrapper.findAllComponents(InputNumber).length).toBe(0)

    expect(
      wrapper
        .findAll('.ant-table-tbody tr')[0]
        .findAll('.ant-table-cell')[2]
        .findAllComponents(Button).length
    ).toBe(1)
    expect(
      wrapper
        .findAll('.ant-table-tbody tr')[0]
        .findAll('.ant-table-cell')[2]
        .findAllComponents(Button)[0]
        .text()
    ).toBe('编 辑')

    await wrapper
      .findAll('.ant-table-tbody tr')[0]
      .findAll('.ant-table-cell')[2]
      .findAllComponents(Button)[0]
      .vm.$emit('click')

    expect(
      wrapper
        .findAll('.ant-table-tbody tr')[0]
        .findAll('.ant-table-cell')[1]
        .findAllComponents(InputNumber).length
    ).toBe(1)

    expect(
      wrapper
        .findAll('.ant-table-tbody tr')[0]
        .findAll('.ant-table-cell')[2]
        .findAllComponents(Button).length
    ).toBe(2)

    expect(
      wrapper
        .findAll('.ant-table-tbody tr')[0]
        .findAll('.ant-table-cell')[2]
        .findAllComponents(Button)[0]
        .text()
    ).toBe('保 存')

    expect(
      wrapper
        .findAll('.ant-table-tbody tr')[0]
        .findAll('.ant-table-cell')[2]
        .findAllComponents(Button)[1]
        .text()
    ).toBe('取 消')

    await wrapper
      .findAll('.ant-table-tbody tr')[0]
      .findAll('.ant-table-cell')[2]
      .findAllComponents(Button)[1]
      .vm.$emit('click')

    expect(wrapper.findAllComponents(InputNumber).length).toBe(0)

    expect(
      wrapper
        .findAll('.ant-table-tbody tr')[0]
        .findAll('.ant-table-cell')[2]
        .findAllComponents(Button).length
    ).toBe(1)
  })

  test('single mode', async () => {
    const data: Person[] = [
      { id: 1, name: 'IconMan', age: 24 },
      { id: 2, name: 'Nicholas', age: 25 },
    ]

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable(() => {
          return {
            editable: {},
            tableProps: {
              rowKey: 'id',
            },
            actionColumn: { show: true },
            toolbar: { show: false },
            search: false,
            data,
            columns: [
              {
                label: '姓名',
                name: 'name',
                columnProps: { width: '30%' },
              },
              {
                label: '年龄',
                name: 'age',
                type: 'digit',
                editable: true,
                columnProps: { width: '30%' },
              },
            ],
          }
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
      attachTo: 'body',
    })

    expect(wrapper.findAllComponents(InputNumber).length).toBe(0)
    expect(wrapper.findAllComponents(Button).length).toBe(2)

    await wrapper.findAllComponents(Button)[0].vm.$emit('click')

    expect(wrapper.findAllComponents(InputNumber).length).toBe(1)
    expect(wrapper.findComponent(InputNumber).find('input').element.value).toBe(
      '24'
    )
    expect(wrapper.findAllComponents(Button).length).toBe(3)

    await wrapper.findAllComponents(Button)[2].vm.$emit('click')

    expect(wrapper.findAllComponents(InputNumber).length).toBe(1)
    expect(wrapper.findAllComponents(Button).length).toBe(3)

    expect(document.querySelectorAll('.ant-message-warning').length).toBe(1)
    expect(
      document
        .querySelector('.ant-message-warning')!
        .querySelectorAll('span')[1].innerHTML
    ).toBe('只能同时编辑一行')
  })

  test('multiple mode', async () => {
    const data: Person[] = [
      { id: 1, name: 'IconMan', age: 24 },
      { id: 2, name: 'Nicholas', age: 25 },
    ]

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable(() => {
          return {
            editable: { type: 'multiple' },
            tableProps: {
              rowKey: 'id',
            },
            actionColumn: { show: true },
            toolbar: { show: false },
            search: false,
            data,
            columns: [
              {
                label: '姓名',
                name: 'name',
                columnProps: { width: '30%' },
              },
              {
                label: '年龄',
                name: 'age',
                type: 'digit',
                editable: true,
                columnProps: { width: '30%' },
              },
            ],
          }
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
      attachTo: 'body',
    })

    expect(wrapper.findAllComponents(InputNumber).length).toBe(0)
    expect(wrapper.findAllComponents(Button).length).toBe(2)

    await wrapper.findAllComponents(Button)[0].vm.$emit('click')

    expect(wrapper.findAllComponents(InputNumber).length).toBe(1)
    expect(
      wrapper.findAllComponents(InputNumber)[0].find('input').element.value
    ).toBe('24')
    expect(wrapper.findAllComponents(Button).length).toBe(3)

    await wrapper.findAllComponents(Button)[2].vm.$emit('click')

    expect(wrapper.findAllComponents(InputNumber).length).toBe(2)
    expect(
      wrapper.findAllComponents(InputNumber)[1].find('input').element.value
    ).toBe('25')
    expect(wrapper.findAllComponents(Button).length).toBe(4)
  })

  test('editable formItem default noStyle is true', async () => {
    const data: Person[] = [
      { id: 1, name: 'IconMan', age: 24 },
      { id: 2, name: 'Nicholas', age: 25 },
    ]

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable(() => {
          return {
            editable: { type: 'multiple' },
            tableProps: {
              rowKey: 'id',
            },
            actionColumn: { show: true },
            toolbar: { show: false },
            search: false,
            data,
            columns: [
              {
                label: '姓名',
                name: 'name',
                columnProps: { width: '30%' },
              },
              {
                label: '年龄',
                name: 'age',
                type: 'digit',
                editable: true,
                columnProps: { width: '30%' },
              },
            ],
          }
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
      attachTo: 'body',
    })

    expect(wrapper.findAllComponents(InputNumber).length).toBe(0)
    expect(wrapper.findAllComponents(Button).length).toBe(2)

    await wrapper.findAllComponents(Button)[0].vm.$emit('click')

    expect(wrapper.findAllComponents(InputNumber).length).toBe(1)
    expect(wrapper.findAllComponents(FormItem).length).toBe(1)
    expect(wrapper.findAllComponents(FormItem)[0].vm.$props.noStyle).toBe(true)
  })

  test('save button loading', async () => {
    const data: Person[] = [
      { id: 1, name: 'IconMan', age: 24 },
      { id: 2, name: 'Nicholas', age: 25 },
    ]

    let args: any[]

    const saveRequest = vi.fn(async (..._args: any[]) => {
      args = _args
      await sleep(1000)
      return true
    })

    let scope: ProTableScope<Person>

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable<Person>(s => {
          scope = s

          return {
            editable: {
              type: 'multiple',
              saveRequest,
              saveToast: 'save success',
            },
            tableProps: {
              rowKey: 'id',
            },
            actionColumn: { show: true },
            toolbar: { show: false },
            search: false,
            data,
            columns: [
              {
                label: '姓名',
                name: 'name',
                columnProps: { width: '30%' },
              },
              {
                label: '年龄',
                name: 'age',
                type: 'digit',
                editable: true,
                columnProps: { width: '30%' },
              },
            ],
          }
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
      attachTo: 'body',
    })

    const editButton = wrapper.findAllComponents(Button)[0]
    expect(editButton.text()).toBe('编 辑')
    expect(saveRequest).toHaveBeenCalledTimes(0)
    expect(wrapper.findAllComponents(InputNumber).length).toBe(0)

    await editButton.vm.$emit('click')

    const saveButton = wrapper.findAllComponents(Button)[0]
    expect(saveButton.text()).toBe('保 存')

    expect(wrapper.findAllComponents(InputNumber).length).toBe(1)

    scope!.table.setEditableRowData(data[0].id, { age: 666, name: '222' })
    await nextTick()

    expect(wrapper.findComponent(InputNumber).find('input').element.value).toBe(
      '666'
    )

    expect(saveButton.vm.$props.loading).toBe(false)
    await saveButton.vm.$emit('click')
    expect(saveButton.vm.$props.loading).toBe(true)

    expect(saveRequest).toHaveBeenCalledTimes(1)
    expect(args!).toMatchInlineSnapshot(`
      [
        {
          "age": 666,
          "id": 1,
          "name": "222",
        },
        {
          "column": {
            "_column": {
              "columnIndex": 2,
              "dictionary": undefined,
              "editable": false,
              "name": undefined,
              "renderCell": [Function],
              "show": true,
              "type": "text",
            },
            "dataIndex": undefined,
            "title": "操作",
          },
          "index": 0,
          "record": {
            "age": 24,
            "id": 1,
            "name": "IconMan",
          },
          "text": {
            "age": 24,
            "id": 1,
            "name": "IconMan",
          },
          "value": {
            "age": 24,
            "id": 1,
            "name": "IconMan",
          },
        },
      ]
    `)

    await sleep(1000)

    expect(document.querySelectorAll('.ant-message-success').length).toBe(1)
    expect(
      document
        .querySelector('.ant-message-success')!
        .querySelectorAll('span')[1].innerHTML
    ).toBe('save success')

    expect(wrapper.findAllComponents(Button).length).toBe(2)
    expect(wrapper.findAllComponents(Button)[0].text()).toBe('编 辑')
    expect(wrapper.findAllComponents(Button)[1].text()).toBe('编 辑')

    expect(
      wrapper.findAll('.ant-table-tbody tr')[0].findAll('td')[0].text()
    ).toBe('IconMan')
    expect(
      wrapper.findAll('.ant-table-tbody tr')[0].findAll('td')[1].text()
    ).toBe('24')
  })

  test('column editable', async () => {
    const data: Person[] = [
      { id: 1, name: 'IconMan', age: 24 },
      { id: 2, name: 'Nicholas', age: 25 },
      { id: 3, name: 'Txl', age: 26 },
    ]

    const App = defineComponent({
      name: 'App',
      setup() {
        let i = 0

        const editableKeys = ref<EditableKeys>([2])

        const { proTableBinding } = buildTable<Person>(() => {
          return {
            editable: {
              type: 'multiple',
              editableKeys,
              saveToast: 'save success',
            },
            tableProps: {
              rowKey: 'id',
            },
            actionColumn: { show: true },
            toolbar: { show: false },
            search: false,
            data,
            columns: [
              {
                label: '姓名',
                name: 'name',
                editable: () => true,
                columnProps: { width: '30%' },
              },
              {
                label: '年龄',
                name: 'age',
                editable: true,
                columnProps: { width: '30%' },
              },
            ],
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'edit-button',
              onClick() {
                if (i === 0) {
                  editableKeys.value.push(1)
                } else {
                  editableKeys.value.push([3, ['age']])
                }
                ++i
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

    expect(wrapper.findAllComponents(Input).length).toBe(2)
    expect(
      wrapper.findAllComponents(Input)[0].find('input').element.value
    ).toBe('Nicholas')
    expect(
      wrapper.findAllComponents(Input)[1].find('input').element.value
    ).toBe('25')

    const editButton = wrapper.find('.edit-button')
    expect(editButton.exists()).toBe(true)

    await editButton.trigger('click')

    expect(wrapper.findAllComponents(Input).length).toBe(4)

    expect(
      wrapper.findAllComponents(Input)[0].find('input').element.value
    ).toBe('IconMan')
    expect(
      wrapper.findAllComponents(Input)[1].find('input').element.value
    ).toBe('24')

    expect(
      wrapper.findAllComponents(Input)[2].find('input').element.value
    ).toBe('Nicholas')
    expect(
      wrapper.findAllComponents(Input)[3].find('input').element.value
    ).toBe('25')

    await editButton.trigger('click')

    expect(wrapper.findAllComponents(Input).length).toBe(5)

    expect(
      wrapper.findAllComponents(Input)[4].find('input').element.value
    ).toBe('26')
  })

  test('editable scope', async () => {
    const data: Person[] = [
      { id: 1, name: 'IconMan', age: 24 },
      { id: 2, name: 'Nicholas', age: 25 },
      { id: 3, name: 'Txl', age: 26 },
    ]

    let scope: ProTableScope<Person>

    let editData: any

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proTableBinding } = buildTable<Person>(s => {
          scope = s

          return {
            editable: {
              type: 'multiple',
              saveToast: 'save success',
            },
            tableProps: {
              rowKey: 'id',
            },
            actionColumn: { show: true },
            toolbar: { show: false },
            search: false,
            data,
            columns: [
              {
                label: '姓名',
                name: 'name',
                editable: () => true,
                columnProps: { width: '30%' },
              },
              {
                label: '年龄',
                name: 'age',
                editable: true,
                columnProps: { width: '30%' },
              },
            ],
          }
        })
        return () => {
          return [
            h(ProTable, proTableBinding),
            h('button', {
              class: 'set-row-button',
              onClick() {
                scope!.table.setEditableRowData(2, {
                  name: 'Nicholas Double',
                  age: 50,
                })
              },
            }),
            h('button', {
              class: 'clear-row-button',
              onClick() {
                scope!.table.clearEditableRowData(2)
              },
            }),
            h('button', {
              class: 'get-row-button',
              onClick() {
                editData = scope!.table.getEditableRowData(2)
              },
            }),
            h('button', {
              class: 'get-rows-button',
              onClick() {
                editData = scope!.table.getEditableRowsData()
              },
            }),
            h('button', {
              class: 'start-row-button',
              onClick() {
                scope!.table.startEdit(2)
              },
            }),
            h('button', {
              class: 'start-cell-button',
              onClick() {
                scope!.table.startEdit(3, ['name'])
              },
            }),
            h('button', {
              class: 'cancel-row-button',
              onClick() {
                scope!.table.cancelEdit(2)
              },
            }),
            h('button', {
              class: 'cancel-cell-button',
              onClick() {
                scope!.table.cancelEdit(3, ['name'])
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

    expect(wrapper.findAllComponents(Input).length).toBe(0)

    const startRowButton = wrapper.find('.start-row-button')
    const startCellButton = wrapper.find('.start-cell-button')

    const setRowButton = wrapper.find('.set-row-button')

    const getRowButton = wrapper.find('.get-row-button')
    const getRowsButton = wrapper.find('.get-rows-button')

    const clearRowButton = wrapper.find('.clear-row-button')

    const cancelRowButton = wrapper.find('.cancel-row-button')
    const cancelCellButton = wrapper.find('.cancel-cell-button')

    await startRowButton.trigger('click')

    expect(wrapper.findAllComponents(Input).length).toBe(2)
    expect(
      wrapper.findAllComponents(Input)[0].find('input').element.value
    ).toBe('Nicholas')
    expect(
      wrapper.findAllComponents(Input)[1].find('input').element.value
    ).toBe('25')

    await setRowButton.trigger('click')

    expect(wrapper.findAllComponents(Input).length).toBe(2)
    expect(
      wrapper.findAllComponents(Input)[0].find('input').element.value
    ).toBe('Nicholas Double')
    expect(
      wrapper.findAllComponents(Input)[1].find('input').element.value
    ).toBe('50')

    await getRowButton.trigger('click')

    expect(editData).toMatchInlineSnapshot(`
      {
        "age": 50,
        "id": 2,
        "name": "Nicholas Double",
      }
    `)

    await startCellButton.trigger('click')

    expect(wrapper.findAllComponents(Input).length).toBe(3)
    expect(
      wrapper.findAllComponents(Input)[0].find('input').element.value
    ).toBe('Nicholas Double')
    expect(
      wrapper.findAllComponents(Input)[1].find('input').element.value
    ).toBe('50')
    expect(
      wrapper.findAllComponents(Input)[2].find('input').element.value
    ).toBe('Txl')

    await getRowsButton.trigger('click')

    expect(editData).toMatchInlineSnapshot(`
      [
        {
          "age": 24,
          "id": 1,
          "name": "IconMan",
        },
        {
          "age": 50,
          "id": 2,
          "name": "Nicholas Double",
        },
        {
          "age": 26,
          "id": 3,
          "name": "Txl",
        },
      ]
    `)

    await clearRowButton.trigger('click')
    await getRowButton.trigger('click')

    expect(editData).toMatchInlineSnapshot(`
      {
        "age": undefined,
        "id": 2,
        "name": undefined,
      }
    `)

    expect(
      wrapper.findAllComponents(Input)[0].find('input').element.value
    ).toBe('')
    expect(
      wrapper.findAllComponents(Input)[1].find('input').element.value
    ).toBe('')

    await cancelRowButton.trigger('click')

    expect(wrapper.findAllComponents(Input).length).toBe(1)
    expect(
      wrapper.findAllComponents(Input)[0].find('input').element.value
    ).toBe('Txl')

    await cancelCellButton.trigger('click')
    expect(wrapper.findAllComponents(Input).length).toBe(0)
  })
})
