import { afterEach } from 'node:test'

import { mount } from '@vue/test-utils'
import antdv, {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Tag,
  message,
} from 'ant-design-vue'
import { describe, test, expect, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { ProCrud, buildCrud } from '..'
import { ProButtonGroup } from '../../ProButton'
import { ProForm } from '../../ProForm'

const sleep = (time: number) => new Promise(r => setTimeout(r, time))

describe('Build Crud', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    Modal.destroyAll()
    message.destroy()
  })

  test('default options', async () => {
    const fetchTableData = vi.fn(async () => {
      await sleep(200)
      return [
        {
          name: 'IconMan',
          age: 24,
        },
      ]
    })

    const editRequest = vi.fn(async () => {
      await sleep(200)
      return true
    })

    const addRequest = vi.fn(async () => {
      await sleep(200)
      return true
    })

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proCrudBinding } = buildCrud(() => {
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

            fetchTableData,
            editRequest,
            editToast: {
              type: 'message',
              props: {
                content: 'edit success',
                duration: 100,
              },
            },
            addRequest,
            addToast: {
              type: 'message',
              props: {
                content: 'add success',
                duration: 100,
              },
            },
          }
        })

        return () => h(ProCrud, proCrudBinding)
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(fetchTableData).toHaveBeenCalledTimes(1)
    expect(wrapper.findComponent(ProCrud).exists()).toBe(true)

    // Search
    expect(wrapper.findAllComponents(ProForm).length).toBe(1)
    expect(
      wrapper.findComponent(ProForm).findAllComponents(Button).length
    ).toBe(2)
    expect(
      wrapper.findComponent(ProForm).findAllComponents(Button)[0].text()
    ).toBe('重 置')
    expect(
      wrapper.findComponent(ProForm).findAllComponents(Button)[1].text()
    ).toBe('搜 索')
    expect(wrapper.findComponent(ProForm).findAllComponents(Input).length).toBe(
      1
    )
    expect(
      wrapper.findComponent(ProForm).findAllComponents(InputNumber).length
    ).toBe(1)

    // Toolbar
    expect(
      wrapper.findAllComponents(ProButtonGroup)[1].findAllComponents(Button)
        .length
    ).toBe(2)
    expect(
      wrapper
        .findAllComponents(ProButtonGroup)[1]
        .findAllComponents(Button)[0]
        .find('.anticon-reload')
        .exists()
    ).toBe(true)
    expect(
      wrapper
        .findAllComponents(ProButtonGroup)[1]
        .findAllComponents(Button)[1]
        .find('.anticon-plus')
        .exists()
    ).toBe(true)

    // Table
    expect(wrapper.findAllComponents(Table).length).toBe(1)
    expect(wrapper.findComponent(Table).vm.$props.loading).toBe(true)

    await sleep(200)
    expect(wrapper.findComponent(Table).vm.$props.loading).toBe(false)
    expect(wrapper.findComponent(Table).findAllComponents(Button).length).toBe(
      3
    )

    expect(
      wrapper.findComponent(Table).findAllComponents(Button)[0].text()
    ).toBe('查 看')
    expect(
      wrapper.findComponent(Table).findAllComponents(Button)[1].text()
    ).toBe('编 辑')
    expect(
      wrapper.findComponent(Table).findAllComponents(Button)[2].text()
    ).toBe('删 除')

    await wrapper.findComponent(Input).find('input').setValue('aaa')
    await wrapper.findComponent(InputNumber).find('input').setValue('99')
    await wrapper
      .findComponent(ProForm)
      .findAllComponents(Button)[1]
      .vm.$emit('click')
    await sleep(0)

    expect(fetchTableData).toHaveBeenCalledTimes(2)
    expect(fetchTableData).toHaveBeenCalledWith({
      page: {
        pageNum: 1,
        pageSize: 10,
      },
      params: {
        name: 'aaa',
        age: 99,
      },
    })

    expect(wrapper.findComponent(Table).vm.$props.loading).toBe(true)

    await sleep(200)

    expect(wrapper.findComponent(Table).vm.$props.loading).toBe(false)

    await wrapper
      .findComponent(ProForm)
      .findAllComponents(Button)[0]
      .vm.$emit('click')

    await nextTick()

    expect(wrapper.findComponent(Input).find('input').element.value).toBe('')
    expect(wrapper.findComponent(InputNumber).find('input').element.value).toBe(
      ''
    )
    expect(wrapper.findComponent(Table).vm.$props.loading).toBe(true)
    await sleep(200)
    expect(wrapper.findComponent(Table).vm.$props.loading).toBe(false)

    const modal = wrapper.findComponent(Modal)

    expect(modal).not.toBe(null)

    // Click View Button
    await wrapper
      .findComponent(Table)
      .findAllComponents(Button)[0]
      .vm.$emit('click')
    await nextTick()

    expect(modal.findComponent(Form).exists()).toBe(true)
    expect(modal.findComponent(Form).vm.$props.disabled).toBe(true)
    expect(modal.findComponent(Input).find('input').element.value).toBe(
      'IconMan'
    )
    expect(modal.findComponent(InputNumber).find('input').element.value).toBe(
      '24'
    )
    expect(modal.findAllComponents(Button).length).toBe(1)
    await modal.findComponent(Button).vm.$emit('click')

    await nextTick()

    expect(modal.findComponent(Form).isVisible()).toBe(false)

    // Click Edit Button
    await wrapper
      .findComponent(Table)
      .findAllComponents(Button)[1]
      .vm.$emit('click')
    await nextTick()

    expect(modal.findComponent(Form).isVisible()).toBe(true)
    expect(modal.findComponent(Form).vm.$props.disabled).toBe(undefined)
    expect(modal.findComponent(Input).find('input').element.value).toBe(
      'IconMan'
    )
    expect(modal.findComponent(InputNumber).find('input').element.value).toBe(
      '24'
    )
    await modal.findComponent(Input).find('input').setValue('IconMan666')
    await modal.findComponent(InputNumber).find('input').setValue('48')

    expect(modal.findAllComponents(Button).length).toBe(2)
    await modal.findAllComponents(Button)[1].vm.$emit('click')
    expect(modal.findAllComponents(Button)[1].vm.$props.loading).toBe(true)

    expect(editRequest).toHaveReturnedTimes(1)
    expect(editRequest).toHaveBeenCalledWith({
      name: 'IconMan666',
      age: 48,
    })

    await sleep(300)

    expect(modal.findAllComponents(Button)[1].vm.$props.loading).toBe(false)
    expect(modal.findComponent(Form).isVisible()).toBe(false)
    expect(
      document
        .querySelector('.ant-message-success')!
        .querySelectorAll('span')[1].innerHTML
    ).toBe('edit success')

    // Click Add Button
    message.destroy()

    await wrapper
      .findAllComponents(ProButtonGroup)[1]
      .findAllComponents(Button)[1]
      .vm.$emit('click')

    await nextTick()

    expect(modal.findComponent(Form).isVisible()).toBe(true)
    expect(modal.findComponent(Form).vm.$props.disabled).toBe(undefined)
    expect(modal.findComponent(Input).find('input').element.value).toBe('')
    expect(modal.findComponent(InputNumber).find('input').element.value).toBe(
      ''
    )

    await modal.findComponent(Input).find('input').setValue('IconMan777')
    await modal.findComponent(InputNumber).find('input').setValue('72')
    // expect(wrapper.findAllComponents(ModalForm).length).toBe(1)

    expect(modal.findAllComponents(Button).length).toBe(2)
    await modal.findAllComponents(Button)[1].vm.$emit('click')
    expect(modal.findAllComponents(Button)[1].vm.$props.loading).toBe(true)

    expect(addRequest).toHaveReturnedTimes(1)
    expect(addRequest).toHaveBeenCalledWith({
      name: 'IconMan777',
      age: 72,
    })

    await sleep(300)

    expect(modal.findAllComponents(Button)[1].vm.$props.loading).toBe(false)
    expect(modal.findComponent(Form).isVisible()).toBe(false)
    expect(
      document
        .querySelector('.ant-message-success')!
        .querySelectorAll('span')[1].innerHTML
    ).toBe('add success')
  })

  test('dictionary only called once', async () => {
    let i = 0

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proCrudBinding } = buildCrud(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
              },
              {
                label: '年龄',
                name: 'age',
                type: 'select',
                dict: {
                  async fetchDictionary() {
                    ++i
                    await sleep(300)
                    return [
                      { label: '10岁', value: 10 },
                      { label: '20岁', value: 20 },
                    ]
                  },
                },
              },
            ],

            fetchTableData() {
              return [{ name: 'IconMan', age: 10 }]
            },
          }
        })

        return () => h(ProCrud, proCrudBinding)
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(i).toBe(1)
    expect(wrapper.findAllComponents(Select).length).toBe(1)
    expect(wrapper.findComponent(Select).vm.$props.loading).toBe(true)
    expect(wrapper.findComponent(Table).vm.$props.dataSource?.length).toBe(1)
    expect(wrapper.findAllComponents(Tag).length).toBe(1)
    expect(wrapper.findComponent(Tag).text()).toBe('')

    await sleep(300)
    expect(wrapper.findComponent(Tag).text()).toBe('10岁')
    expect(i).toBe(1)

    expect(wrapper.findComponent(Table).findAllComponents(Button).length).toBe(
      3
    )
    await wrapper
      .findComponent(Table)
      .findAllComponents(Button)[1]
      .vm.$emit('click')
    await nextTick()

    const modal = wrapper.findComponent(Modal)
    expect(modal.findAllComponents(Select).length).toBe(1)
    expect(modal.findComponent(Select).vm.$props.options?.length).toBe(2)
    expect(modal.findComponent(Select).text()).toBe('10岁')

    expect(i).toBe(1)
  })

  test('toggle visible', async () => {
    const tableShow = ref(true)
    const searchShow = ref(true)
    const addFormShow = ref(true)
    const editFormShow = ref(true)
    const viewFormShow = ref(true)

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proCrudBinding } = buildCrud(() => {
          return {
            columns: [
              {
                label: '姓名',
                name: 'name',
                show: tableShow,
                search: { show: searchShow },
                addForm: { show: addFormShow },
                editForm: { show: editFormShow },
                viewForm: { show: viewFormShow },
              },
            ],

            fetchTableData() {
              return [{ name: 'IconMan', age: 10 }]
            },
          }
        })

        return () => h(ProCrud, proCrudBinding)
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findComponent(ProForm).findComponent(Input).exists()).toBe(
      true
    )
    expect(
      wrapper.findComponent(Table).findAll('.ant-table-thead th').length
    ).toBe(2)

    searchShow.value = false
    tableShow.value = false

    await sleep(0)

    expect(wrapper.findComponent(ProForm).findComponent(Input).exists()).toBe(
      false
    )
    expect(
      wrapper.findComponent(Table).findAll('.ant-table-thead th').length
    ).toBe(1)

    expect(wrapper.findComponent(Table).findAllComponents(Button).length).toBe(
      3
    )

    const modal = wrapper.findComponent(Modal)

    async function visible(visible: boolean) {
      // View
      await wrapper
        .findComponent(Table)
        .findAllComponents(Button)[0]
        .vm.$emit('click')
      await nextTick()

      expect(modal.findAllComponents(Input).length).toBe(visible ? 1 : 0)

      modal.findAllComponents(Button)[0].vm.$emit('click')

      await nextTick()

      // Edit
      await wrapper
        .findComponent(Table)
        .findAllComponents(Button)[1]
        .vm.$emit('click')
      await nextTick()

      expect(modal.findAllComponents(Input).length).toBe(visible ? 1 : 0)

      modal.findAllComponents(Button)[0].vm.$emit('click')

      await nextTick()

      // Add
      await wrapper
        .findAllComponents(ProButtonGroup)[1]
        .findAllComponents(Button)[1]
        .vm.$emit('click')
      await nextTick()

      expect(modal.findAllComponents(Input).length).toBe(visible ? 1 : 0)

      modal.findAllComponents(Button)[0].vm.$emit('click')

      await nextTick()
    }

    visible(true)
    // visible(false)
  })
})
