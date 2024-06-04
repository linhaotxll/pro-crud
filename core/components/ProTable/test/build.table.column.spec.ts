import { mount } from '@vue/test-utils'
import antdv from 'ant-design-vue'
import { describe, expect, test, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { buildTable } from '../buildTable'
import { ProTable } from '../ProTable'

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
})
