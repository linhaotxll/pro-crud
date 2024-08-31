import { mount, flushPromises } from '@vue/test-utils'
import antdv, { Input, Select } from 'ant-design-vue'
import { describe, test, expect, vi } from 'vitest'
import { defineComponent, h, ref, toValue } from 'vue'

import { ProForm, buildForm } from '..'

import type { ProFormInstance, ProFormScope } from '..'

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
    const resultParasm = {
      time,
      username: `${newUsername}${time}`,
      gender: 'male',
    }

    const onClick = vi.fn(() => {
      return scope.submit()
    })

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
              { label: '性别', name: 'gender', submitted: () => true },
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
              onClick,
            }),
            h('button', {
              class: 'set-button',
              onClick() {
                scope.setFieldValue('username', newUsername)
                scope.setFieldValue('password', 'admin123')
                scope.setFieldValue('gender', 'male')
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

    expect(submitRequest).toBeCalledTimes(0)
    expect(successRequest).toBeCalledTimes(0)
    expect(validateFail).toBeCalledTimes(0)
    expect(beforeSubmit).toBeCalledTimes(0)

    const setButton = wrapper.find('.set-button')
    expect(setButton.exists()).toBe(true)

    await setButton.trigger('click')
    await submitButton.trigger('click')
    await flushPromises()

    expect(submitRequest).toHaveBeenCalledWith(resultParasm)
    expect(successRequest).toBeCalledTimes(1)
    expect(validateFail).toBeCalledTimes(0)
    expect(beforeSubmit).toBeCalledTimes(1)
  })

  test('setFieldValue with transform', async () => {
    let scope!: ProFormScope<any>

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(_scope => {
          scope = _scope
          return {
            initialValues: { status: [2] },
            columns: [
              {
                label: '用户名',
                name: 'status',
                type: 'select',
                dict: {
                  data: [
                    { label: '状态一', value: 1 },
                    { label: '状态二', value: 2 },
                    { label: '状态三', value: 3 },
                  ],
                },
                fieldProps: { mode: 'multiple' },
                transform: {
                  from(serverValue) {
                    return serverValue?.split(',').map(Number)
                  },
                },
              },
            ],
          }
        })

        return () => {
          return [
            h(ProForm, proFormBinding),
            h('button', {
              class: 'set-button',
              onClick() {
                scope.setFieldValue('status', '2,3')
              },
            }),
          ]
        }
      },
    })

    const wrapper = mount(App, {
      global: { plugins: [antdv] },
    })

    expect(wrapper.findAllComponents(ProForm).length).toBe(1)
    expect(wrapper.findAllComponents(Select).length).toBe(1)
    expect(wrapper.findComponent(Select).props().value).toStrictEqual([2])

    const setButton = wrapper.find('.set-button')
    expect(setButton.exists()).toBe(true)

    await setButton.trigger('click')
    expect(wrapper.findComponent(Select).props().value).toStrictEqual([2, 3])
  })

  test('pro form ref', () => {
    const proFormRef = ref<ProFormInstance | null>(null)

    const App = defineComponent({
      name: 'App',
      setup() {
        const { proFormBinding } = buildForm(() => {
          return {
            columns: [
              {
                label: '用户名',
                name: 'name',
              },
            ],
          }
        })

        return () => {
          return [h(ProForm, { ...proFormBinding, ref: proFormRef })]
        }
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [antdv],
      },
    })

    expect(wrapper.findComponent(ProForm).exists()).toBe(true)
    expect(toValue(proFormRef)).not.toBe(null)
    expect(Object.keys(toValue(proFormRef)!).length).toBe(10)
    expect(toValue(proFormRef)).toHaveProperty('getFormValues')
    expect(toValue(proFormRef)).toHaveProperty('submit')
    expect(toValue(proFormRef)).toHaveProperty('reset')
    expect(toValue(proFormRef)).toHaveProperty('setFieldValue')
    expect(toValue(proFormRef)).toHaveProperty('setFieldValues')
    expect(toValue(proFormRef)).toHaveProperty('getFieldValue')
    expect(toValue(proFormRef)).toHaveProperty('removeFields')
    expect(toValue(proFormRef)).toHaveProperty('validate')
    expect(toValue(proFormRef)).toHaveProperty('scrollToField')
    expect(toValue(proFormRef)).toHaveProperty('clearValidate')
  })
})
