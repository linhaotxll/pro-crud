import { mount } from '@vue/test-utils'
import antdv from 'ant-design-vue'
import { Input } from 'ant-design-vue'
import { describe, test, expect } from 'vitest'

import { ProForm, buildForm } from '..'

describe('Pro Form Types', () => {
  test('no type', async () => {
    const { proFormBinding } = buildForm(() => {
      return {
        columns: [{ label: '用户名', name: 'username' }],
      }
    })

    const wrapper = mount(ProForm, {
      props: proFormBinding,
      global: {
        plugins: [antdv], // 修改这里
      },
    })

    expect(wrapper.findComponent(Input).find('input').exists()).toBe(true)
  })

  test('text type', async () => {
    const { proFormBinding } = buildForm(() => {
      return {
        columns: [{ label: '用户名', name: 'username', type: 'text' }],
      }
    })

    const wrapper = mount(ProForm, {
      props: proFormBinding,
      global: {
        plugins: [antdv], // 修改这里
      },
    })

    expect(wrapper.findComponent(Input).find('input').exists()).toBe(true)
  })
})
