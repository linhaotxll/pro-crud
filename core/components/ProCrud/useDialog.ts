import { merge } from 'lodash-es'
import { ref, toValue } from 'vue'

import type { ProFormInstance } from '../ProForm'
import type { ModalProps } from 'ant-design-vue'

export function useDialog<T extends object = any>(form: ProFormInstance<T>) {
  const open = ref(false)

  function showDialog(values?: T) {
    open.value = true
    clear(values)
  }

  function hideDialog() {
    open.value = false
  }

  function clear(values?: T) {
    form.reset()

    if (values) {
      setTimeout(() => {
        form.setFieldValuesTransform(values)
      })
    }
  }

  function merged(props?: ModalProps) {
    const mergedProps = merge({}, props, { open, onClose: hideDialog })
    return Object.entries(mergedProps).reduce((prev, [key, prop]) => {
      // @ts-ignore
      prev[key] = toValue(prop)
      return prev
    }, {})
  }

  return {
    showDialog,
    hideDialog,
    merged,
    clear,
  }
}
