import { merge } from 'lodash-es'
import { computed, ref } from 'vue'

import { unRef, type ElDialogProps } from '../common'

import type { ProFormInstance } from '../ProForm'
import type { ComputedRef } from 'vue'

export function useDialog<T extends object = any>(
  form: ProFormInstance<T>,
  props?: ElDialogProps
) {
  const modelValue = ref(false)

  function showDialog(values?: T) {
    modelValue.value = true
    if (values) {
      form.setFieldValues(values)
    }
  }

  function hideDialog() {
    modelValue.value = false
  }

  const mergeProps = merge({}, props, { modelValue, onClose: hideDialog })

  const dialogProps: ComputedRef<ElDialogProps> = computed<ElDialogProps>(
    () => {
      return Object.entries(mergeProps).reduce((prev, [key, prop]) => {
        // @ts-ignore
        prev[key] = unRef(prop)
        return prev
      }, {})
    }
  )

  return {
    showDialog,
    hideDialog,
    dialogProps,
  }
}
