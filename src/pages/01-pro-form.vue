<template>
  <ProButtonGroup :action="buttonGroup" />
</template>

<script lang="tsx" setup>
import { ref, watchEffect } from 'vue'

import { buildButtonGroup, ProButtonGroup } from '~/components/ProButton'

import type { PopconfirmProps } from 'ant-design-vue'
import type { ProButtonConfirmType } from '~/components/ProButton'

const confirmType = ref<ProButtonConfirmType>('popconfirm')
const confirmProps = ref<PopconfirmProps>({
  cancelText: '取消',
  onConfirm() {
    console.log('confirm')
  },
  onVisibleChange() {
    console.log('onVisibleChange')
  },
})

function buttonOnClick() {
  console.log('click')
}

const buttonGroup = buildButtonGroup({
  actions: {
    confirm: {
      show: true,
      text: '确认',
      confirmType,
      confirmProps,
      props: { onClick: buttonOnClick },
    },
  },
})
</script>
