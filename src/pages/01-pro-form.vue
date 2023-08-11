<template>
  <div>
    <!-- <test-a :visible="ref(visible)" /> -->
    <pro-form ref="proFormRef" v-bind="proFormBinding" />

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

import { buildForm } from '~/components/ProForm'

import type { ColProps, RowProps } from 'element-plus'

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
const col = ref<Partial<ColProps>>({ span: 14 })

const nameCol = ref<Partial<ColProps>>({ span: 14 })
const nameLabel = ref('名称')

const buttonsShow = ref(true)
const buttonsCol = ref<Partial<ColProps>>({ span: 18 })
const buttonConfirmShow = ref(true)
const nameProp = ['info', 'name']
const personProp = ['person', 'info']

const { proFormRef, proFormBinding } = buildForm<FormValues>(scope => {
  return {
    row,
    col,
    initialValues: {
      gender: 3,
      info: { name: 'lalala' },
      person: { info: { name: '111', age: '21' } },
      nickname: 'nic',
    },
    formProps: {
      labelWidth,
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
        type: 'dict-select',
        prop: 'gender',
        itemProps: {
          rules: { required: true, message: '请选择性别' },
        },
        fieldProps: { clearable: true },
        fieldSlots: {},
        dict: {
          async fetchData() {
            await sleep(3000)
            return [
              { name: '男', gender: 1 },
              { name: '女', gender: 2 },
              { name: '自定义', gender: 3 },
            ]
          },
          // data: [
          //   { name: '男', gender: 1 },
          //   { name: '女', gender: 2 },
          //   { name: '自定义', gender: 3 },
          // ],
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
          // debugger
          // console.log('aaa: ', scope.getFormValues().gender)
          return scope.getFieldValue('gender') === 3
        }),
        preserve: false,
        itemProps: {
          rules: { required: true, message: '请填写自定义性别' },
        },
      },
      {
        label: '状态',
        type: 'dict-select',
        prop: 'status',
        fieldProps: {
          placeholder: '啦啦啦',
        },
        dict: {
          fetchData: fetchStatusData,
          labelField: 'statusName',
        },
      },

      {
        label: '信息',
        type: 'info',
        prop: personProp,
      },

      {
        label: '昵称',
        type: 'nickname',
        prop: 'nickname',
      },

      {
        label: '数字',
        type: 'digit',
        prop: 'digit',
        fill: false,
      },

      {
        label: '滑块',
        type: 'slider',
        prop: 'slider',
      },

      {
        label: '开关',
        type: 'switch',
        prop: 'switch',
      },

      {
        label: '日期',
        type: 'date',
        prop: 'date',
      },

      {
        label: '周',
        type: 'date-week',
        prop: 'dateWeek',
        fieldProps: {
          placeholder: '啊啊啊',
        },
      },

      {
        label: '月',
        type: 'date-month',
        prop: 'dateMonth',
      },

      {
        label: '年',
        type: 'date-year',
        prop: 'dateYear',
      },

      {
        label: '多个日期',
        type: 'date-dates',
        prop: 'dateDates',
      },

      {
        label: '日期范围',
        type: 'date-range',
        prop: 'dateRange',
      },

      {
        label: '月范围',
        type: 'date-month-range',
        prop: 'dateMonthRange',
      },

      {
        label: '日期时间',
        type: 'date-time',
        prop: 'dateTime',
      },

      {
        label: '日期时间范围',
        type: 'date-time-range',
        prop: 'dateTimeRange',
      },

      {
        label: '时间',
        type: 'time',
        prop: 'time',
      },

      {
        label: '时间范围',
        type: 'time-range',
        prop: 'timeRange',
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

        setPerson: {
          show: true,
          text: '设置基本信息',
          props: {
            onClick() {
              // scope.setFieldValue(['info', 'name'], 'Nicholas')
              scope.setFieldValues({
                'person.info': { name: 'Nicholas', age: '24' },
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

    request: {
      async submitRequest(values) {
        console.log('submit: ', values)
        return false
      },

      validateFail(error) {
        console.log('校验失败: ', error)
      },
    },
    // toast: false,
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
