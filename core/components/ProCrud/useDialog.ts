import { merge } from 'lodash-es'
import { computed, ref } from 'vue'

import { unRef, type ElDialogProps } from '../common'

import type { ProFormInstance } from '../ProForm'

export function useDialog<T extends object = any>(form: ProFormInstance<T>) {
  const modelValue = ref(false)

  function showDialog(values?: T) {
    modelValue.value = true
    form.reset()
    if (values) {
      form.setFieldValues(values)
    }
  }

  function hideDialog() {
    modelValue.value = false
  }

  function merged(props?: ElDialogProps) {
    const mergedProps = merge({}, props, { modelValue, onClose: hideDialog })
    return computed(() =>
      Object.entries(mergedProps).reduce((prev, [key, prop]) => {
        // @ts-ignore
        prev[key] = unRef(prop)
        return prev
      }, {})
    )
  }

  return {
    showDialog,
    hideDialog,
    merged,
  }
}
