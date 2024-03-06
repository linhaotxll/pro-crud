import { mount, flushPromises } from '@vue/test-utils'
import antdv, { Input } from 'ant-design-vue'
import { describe, test, expect, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { ProForm, buildForm } from '..'

import type { ProFormScope } from '..'

describe('Pro Form Scope', () => {
  test('getFormValues', async () => {
    const initialValues = { username: 'admin', password: 'admin123' }
    let scope!: ProFormScope<any>
    const { proFormBinding } = buildForm(_scope => {
      scope = _scope
      return {
        initialValues,
        columns: [
          { label: '用户名', name: 'username' },
          { label: 'password', name: 'password' },
        ],
      }
    })

    const wrapper = mount(ProForm, {
      props: proFormBinding,
      global: {
        plugins: [antdv],
      },
    })

    expect(scope.getFormValues()).toMatchObject(initialValues)
    expect(scope.getFieldValue('username')).toBe('admin')
    expect(scope.getFieldValue('password')).toBe('admin123')

    expect(wrapper.findAllComponents(Input).length).toBe(2)
    expect(wrapper.findAll('input')[0].element.value).toBe('admin')
    expect(wrapper.findAll('input')[1].element.value).toBe('admin123')
  })

  test('reset', async () => {
    const show = ref(false)
    let scope!: ProFormScope<any>
    const initialValues = { username: 'admin', password: 'admin123' }

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(_scope => {
          scope = _scope
          return {
            initialValues,
            columns: [
              { label: '用户名', name: 'username' },
              { label: '密码', name: 'password' },
              { label: '性别', name: 'gender', show },
            ],
          }
        })

        return () => {
          return [
            h(ProForm, proFormBinding),
            h('button', {
              class: 'reset-button',
              onClick() {
                scope.reset()
              },
            }),
            h('button', {
              class: 'show-button',
              onClick() {
                show.value = !show.value
              },
            }),
            h('button', {
              class: 'set-button',
              onClick() {
                scope.setFieldValues({
                  gender: '1',
                })
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

    expect(scope.getFormValues()).toMatchObject(initialValues)

    expect(wrapper.findAll('input').length).toBe(2)
    expect(wrapper.findAll('input')[0].element.value).toBe('admin')
    expect(wrapper.findAll('input')[1].element.value).toBe('admin123')

    const setButton = wrapper.find('.set-button')
    expect(setButton.exists()).toBe(true)

    await setButton.trigger('click')

    const showButton = wrapper.find('.show-button')
    expect(showButton.exists()).toBe(true)

    await showButton.trigger('click')

    expect(wrapper.findAll('input')[0].element.value).toBe('admin')
    expect(wrapper.findAll('input')[1].element.value).toBe('admin123')
    expect(wrapper.findAll('input')[2].element.value).toBe('1')

    const resetButton = wrapper.find('.reset-button')
    expect(resetButton.exists()).toBe(true)

    await resetButton.trigger('click')

    expect(wrapper.findAll('input')[0].element.value).toBe('admin')
    expect(wrapper.findAll('input')[1].element.value).toBe('admin123')
    expect(wrapper.findAll('input')[2].element.value).toBe('')
  })

  test('submit', async () => {
    const time = Date.now()
    const submitRequest = vi.fn(() => true)
    const successRequest = vi.fn()
    const validateFail = vi.fn()
    const beforeSubmit = vi.fn((values: any) => ({
      ...values,
      time,
    }))
    let scope!: ProFormScope<any>
    const newUsername = 'admin'
    const resultParasm = { time, username: `${newUsername}${time}` }

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(_scope => {
          scope = _scope
          return {
            columns: [
              {
                label: '用户名',
                name: 'username',
                transform: {
                  to(formValue) {
                    return formValue + time
                  },
                },
              },
              { label: '密码', name: 'password', submitted: false },
            ],
            submitRequest,
            successRequest,
            validateFail,
            beforeSubmit,
            formProps: {
              rules: {
                username: { required: true, message: '请填写用户名', min: 2 },
              },
            },
          }
        })

        return () => {
          return [
            h(ProForm, proFormBinding),
            h('button', {
              class: 'submit-button',
              async onClick() {
                await scope.submit()
              },
            }),
            h('button', {
              class: 'set-button',
              onClick() {
                scope.setFieldValue('username', newUsername)
                scope.setFieldValue('password', 'admin123')
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App)

    expect(submitRequest).toBeCalledTimes(0)
    expect(successRequest).toBeCalledTimes(0)
    expect(validateFail).toBeCalledTimes(0)
    expect(beforeSubmit).toBeCalledTimes(0)

    const submitButton = wrapper.find('.submit-button')
    expect(submitButton.exists()).toBe(true)

    await submitButton.trigger('click')
    await flushPromises()

    expect(submitRequest).toBeCalledTimes(0)
    expect(successRequest).toBeCalledTimes(0)
    expect(validateFail).toBeCalledTimes(1)
    expect(beforeSubmit).toBeCalledTimes(0)

    const setButton = wrapper.find('.set-button')
    expect(setButton.exists()).toBe(true)

    await setButton.trigger('click')
    await submitButton.trigger('click')
    await flushPromises()

    expect(submitRequest).toHaveBeenCalledWith(resultParasm)
    expect(successRequest).toBeCalledTimes(1)
    expect(validateFail).toBeCalledTimes(1)
    expect(beforeSubmit).toBeCalledTimes(1)
  })
})
