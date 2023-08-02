<template>
  <div>
    <!-- <test-a :visible="ref(visible)" /> -->
    <pro-form ref="proFormRef" v-bind="formBinding" />

    <preview-form />

    <!-- <el-select :name="" /> -->

    <button @click="handleChangeNameCol">Change Name Col</button>
    <button @click="handleChangeNameLabel">Change Name Label</button>
    <button @click="handleChangeNameType">Change Name Type</button>
    <button @click="handleToggleButtonsShow">Toggle Buttons Show</button>
    <button @click="handleToggleConfirmButtonShow">
      Toggle Confirm Button Show
    </button>
  </div>
</template>

<script lang="tsx" setup>
import { computed } from 'vue'
import { ref } from 'vue'

import PreviewForm from './preview-form.vue'

import { buildForm } from '~/components/ProForm'

import type { ColProps, RowProps } from 'element-plus'
import type { ElColProps } from '~/components/ProForm'

const sleep = (time = 2000) => new Promise(r => setTimeout(r, time))

const fetchStatusData = async () => {
  await sleep()
  return [
    { statusName: '启用', value: 1 },
    { statusName: '禁用', value: 2 },
  ]
}

interface FormValues {
  name: string
  status: number
  gender: number
  customSex?: string
}

const labelWidth = ref('100px')
const row = ref<Partial<RowProps>>({ gutter: 8 })
const col = ref<Partial<ColProps>>({ span: 24 })

const nameCol = ref<Partial<ColProps>>({ span: 4 })
const nameLabel = ref('名称')

const buttonsShow = ref(true)
const buttonsCol = ref<ElColProps>({ span: 18 })
const buttonConfirmShow = ref(true)
const nameProp = ['info', 'name']

const { formBinding, proFormRef } = buildForm<FormValues>(scope => {
  return {
    row,
    col,
    initialValues: { gender: 3, info: { name: 'lalala' } },
    formProps: {
      labelWidth,
    },
    validateFail(error) {
      console.log('校验失败: ', error)
    },

    columns: [
      {
        label: nameLabel,
        prop: nameProp,
        type: 'text',
        col: nameCol,
        tooltip: '姓名',
        itemProps: {
          rules: { required: true, message: '请填写名称' },
        },
        itemSlots: {
          error: msg => {
            return <div style="color: #f99">{msg}</div>
          },
        },
        fieldProps: {},
        dict: {
          data: [],
        },
      },

      {
        label: '性别',
        type: 'select',
        prop: 'gender',
        itemProps: {
          rules: { required: true, message: '请选择性别' },
        },
        fieldProps: { clearable: true },
        fieldSlots: {},
        dict: {
          data: [
            { name: '男', gender: 1 },
            { name: '女', gender: 2 },
            { name: '自定义', gender: 3 },
          ],
          labelField: 'name',
          valueField: 'gender',
        },
        tooltip: {
          placement: 'right',
          slots: {
            content: () => <span>啦啦啦</span>,
            icon: style => <span style={style}>i</span>,
          },
        },
        submitted(scope) {
          return scope.getFieldValue('gender') !== 3
        },
      },
      {
        label: '自定义性别',
        prop: 'customGender',
        show: computed(() => {
          // console.log('aaa: ', scope.getFormValues().gender)
          return scope.getFormValues()?.gender === 3
        }),
        preserve: false,
        itemProps: {
          rules: { required: true, message: '请填写自定义性别' },
        },
      },
      {
        label: '状态',
        type: 'select',
        prop: 'status',
        dict: {
          fetchData: fetchStatusData,
          labelField: 'statusName',
        },
      },
    ],

    buttons: {
      show: buttonsShow,
      col: buttonsCol,
      list: {
        confirm: {
          show: buttonConfirmShow,
          props: {},
        },

        reset: {
          show: true,
          text: '重置',
          props: {
            type: 'danger',
            onClick() {
              scope.reset()
            },
          },
        },

        setName: {
          show: true,
          text: '设置姓名',
          props: {
            onClick() {
              // scope.setFieldValue(['info', 'name'], 'Nicholas')
              scope.setFieldValues({
                'info.name': 'IconMan',
              })

              // alert(scope.getFieldValue('info.name'))
            },
          },
        },

        removeName: {
          show: true,
          text: '删除姓名',
          props: {
            onClick() {
              scope.removeFields('info')
            },
          },
        },

        scrollStatus: {
          show: true,
          text: '滑到状态',
          props: {
            onClick() {
              scope.scrollToField('gender')
            },
          },
        },

        validate: {
          show: true,
          text: '验证',
          props: {
            async onClick() {
              const res = await scope.validate()
              console.log(res)
            },
          },
        },

        validateField: {
          show: true,
          text: '验证name',
          props: {
            async onClick() {
              const res = await scope.validateField([nameProp])
              console.log(res)
            },
          },
        },

        clearValidate: {
          show: true,
          text: 'clear name',
          props: {
            onClick() {
              scope.clearValidate([nameProp])
            },
          },
        },

        getInstance: {
          show: true,
          text: 'getInstance',
          props: {
            onClick() {
              console.log(scope.getFieldInstance(nameProp))
            },
          },
        },
      },
    },

    // toast: false,
    async submitRequest(values) {
      console.log('submit: ', values)
      return true
    },
  }
})

function handleChangeNameCol() {
  nameCol.value = { span: nameCol.value.span! + 1 }
}

function handleChangeNameLabel() {
  nameLabel.value = nameLabel.value === '名称' ? 'Name' : '名称'
}

function handleChangeNameType() {
  // nameType.value = nameType.value === 'text' ? 'select' : 'text'
}

function handleToggleButtonsShow() {
  buttonsShow.value = !buttonsShow.value
}

function handleToggleConfirmButtonShow() {
  buttonConfirmShow.value = !buttonConfirmShow.value
}
</script>
