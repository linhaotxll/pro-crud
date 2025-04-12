import { message } from 'ant-design-vue'

import { isVueNode } from '../../utils'
import { mergeWithTovalue } from '../common'

import { getGlobalOptions } from '~/constant'

import type { ToastOptions } from './interface'
import type { MessageArgsProps, NoticeType } from 'ant-design-vue/es/message'

export function showToast(option: ToastOptions = {}, type: NoticeType) {
  const optionType = option[type]
  if (optionType === false) {
    return
  }

  // @ts-ignore
  if (typeof optionType?.show === 'function') {
    // @ts-ignore
    return optionType.show()
  }

  return message.open(mergeToastOptions(option, type))
}

export function showSuccessToast(option: ToastOptions) {
  return showToast(option, 'success')
}

export function showErrorToast(option: ToastOptions) {
  return showToast(option, 'error')
}

export function showWarningToast(option: ToastOptions) {
  return showToast(option, 'warning')
}

export function showInfoToast(option: ToastOptions) {
  return showToast(option, 'info')
}

export function showLoadingToast(option: ToastOptions) {
  return showToast(option, 'loading')
}

export function mergeToastOptions(option: ToastOptions = {}, type: NoticeType) {
  const typeOption = option
    ? isVueNode(option[type])
      ? { content: option[type] ?? '' }
      : option[type]
    : null

  const typeConfig = option?.config

  const globalOption = getGlobalOptions().toast
  const globalConfig = globalOption?.config
  const globalTypeOption =
    globalOption && globalOption[type]
      ? isVueNode(globalOption[type])
        ? { content: globalOption[type] ?? '' }
        : globalOption[type]
      : null

  return mergeWithTovalue<MessageArgsProps>(
    {},
    globalConfig,
    globalTypeOption,
    typeConfig,
    typeOption,
    { type }
  )
}
