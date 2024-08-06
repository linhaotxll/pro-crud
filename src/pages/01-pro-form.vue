<template>
  <steps-form v-bind="stepsFormBinding" />
</template>

<script lang="tsx" setup>
import { buildStepsForm } from '~/index'

interface FormState {
  info: {
    name: string
  }
  extends: {
    school: string
  }
}

const { stepsFormBinding } = buildStepsForm<FormState>(() => {
  return {
    steps: {
      info: {
        title: '基本信息',
        columns: [
          {
            label: '姓名',
            name: 'name',
          },
        ],
      },

      extends: {
        title: '扩展信息',
        columns: [
          {
            label: '学校',
            name: 'school',
            type: 'select',
            dict: {
              data: [{ label: '清华大学', value: 'qh' }],
            },
          },
        ],
      },
    },
  }
})
</script>
