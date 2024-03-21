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
    <button @click="formLabelCol = { span: +formLabelCol.span! + 1 }">
      Change Form Label Col
    </button>
  </div>
</template>

<script lang="tsx" setup>
import { message, type ColProps } from 'ant-design-vue'
import { computed } from 'vue'
import { ref } from 'vue'

import { buildForm } from '~/components/ProForm'

const sleep = (time = 2000) => new Promise(r => setTimeout(r, time))

// const fetchStatusData = async () => {
//   await sleep()
//   return [
//     { statusName: '启用', value: 1 },
//     { statusName: '禁用', value: 2 },
//   ]
// }

interface FormValues {
  name: string
  status: number
  gender: number
  customSex?: string
}

// const labelWidth = ref('100px')
// const row = ref<Partial<RowProps>>({ gutter: 8 })
// const col = ref<Partial<ColProps>>({ span: 14 })

const nameCol = ref<ColProps>({ span: 4 })
const nameLabel = ref('名称')
const nameType = ref<string>('text')

const buttonsShow = ref(true)
// const buttonsCol = ref<Partial<ColProps>>({ span: 18, offset: 6 })
const formLabelCol = ref<ColProps>({ span: 2 })
const buttonConfirmShow = ref(true)
const nameProp = ['info', 'name']
const personProp = ['person', 'info']

// @ts-ignore
const { proFormRef, proFormBinding } = buildForm<FormValues>(scope => {
  return {
    // row,
    // col,
    initialValues: {
      gender: 3,
      info: { name: 'lalala' },
      person: { info: { name: '111', age: '21' } },
      nickname: 'nic',
      slider: 0,
      status: 1,
      list: [{ status: 2, name: 'IconMan' }],
    },
    formProps: {
      labelCol: formLabelCol,
      wrapperCol: { span: 20 },
      rules: {
        list: {
          required: true,
          message: '请增加列表',
        },
      },
      // scrollToFirstError: true,
    },

    columns: [
      {
        label: '列表',
        name: 'list',
        type: 'list',
        children: [
          {
            label: '状态',
            name: 'status',
            col: { span: 12 },
            type: 'dict-select',
            dict: {
              async fetchData() {
                console.log('fetch')
                message.success('获取列表状态数据')
                return [
                  { label: '男', value: 1 },
                  { label: '女', value: 2 },
                  { label: '自定义', value: 3 },
                ]
              },
            },
          },
          {
            label: '姓名',
            name: 'name',
            itemProps: {
              rules: {
                required: true,
                message: '请填写姓名',
              },
            },
          },
          // {
          //   label: '子控件',
          //   name: 'a',
          //   col: { span: 12 },
          //   type: 'list',
          //   list: {
          //     creatorButtonProps: false,
          //   },
          //   children: [
          //     {
          //       label: '信息',
          //       name: 'b',
          //       // type: 'text'
          //     },
          //   ],
          // },
        ],
        list: {
          creatorButtonProps: {
            creatorButtonText: '加一条数据',
          },
          max: 3,
          min: 2,
          // deleteButtonProps: false,
        },
        itemProps: {
          rules: {
            required: true,
            message: '请填写列表',
          },
        },
      },

      {
        label: '昵称',
        name: 'name',
      },
      {
        label: nameLabel,
        name: nameProp,
        type: nameType,
        tooltip: '姓名',
        itemProps: {
          labelCol: nameCol,
          rules: { required: true, message: '请填写名称' },
        },
        // itemSlots: {
        //   error: msg => {
        //     return <div style="color: #f99">{msg}</div>
        //   },
        // },
        fieldProps: {},
        dict: {
          data: [{ label: '选项一', value: 1 }],
        },
      },

      {
        label: '性别',
        type: 'dict-select',
        name: 'gender',
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
            title: () => <span>啦啦啦</span>,
            default: style => <span style={style}>i</span>,
          },
        },
        submitted(scope) {
          return scope.getFieldValue('gender') !== 3
        },
      },
      {
        label: '自定义性别',
        name: 'customGender',
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
        name: 'status',
        fieldProps: {
          placeholder: '啦啦啦',
        },
        dict: {
          useCollect(dictSet) {
            // debugger
            console.log(123, dictSet)
            return dictSet?.status
          },
          // fetchData: fetchStatusData,
          labelField: 'statusName',
        },
      },

      {
        label: '信息',
        type: 'info',
        name: personProp,
      },

      {
        label: '昵称',
        type: 'nickname',
        name: 'nickname',
      },

      {
        label: '数字',
        type: 'digit',
        name: 'digit',
        fill: true,
      },

      {
        label: '滑块',
        type: 'slider',
        name: 'slider',
      },

      {
        label: '开关',
        type: 'switch',
        name: 'switch',
      },

      {
        label: '日期',
        type: 'date',
        name: 'date',
      },

      {
        label: '周',
        type: 'date-week',
        name: 'dateWeek',
        fieldProps: {
          placeholder: '啊啊啊',
        },
      },

      {
        label: '月',
        type: 'date-month',
        name: 'dateMonth',
      },

      {
        label: '年',
        type: 'date-year',
        name: 'dateYear',
      },

      {
        label: '日期范围',
        type: 'date-range',
        name: 'dateRange',
      },

      {
        label: '月范围',
        type: 'date-month-range',
        name: 'dateMonthRange',
      },

      {
        label: '日期时间',
        type: 'date-time',
        name: 'dateTime',
      },

      {
        label: '日期时间范围',
        type: 'date-time-range',
        name: 'dateTimeRange',
      },

      {
        label: '时间',
        type: 'time',
        name: 'time',
      },

      {
        label: '时间范围',
        type: 'time-range',
        name: 'timeRange',
      },
    ],

    actions: {
      show: buttonsShow,
      // wrapperCol: buttonsCol,
      space: {
        size: 32,
      },
      list: {
        confirm: {
          show: buttonConfirmShow,
          text: '啦啦啦',
          props: {},
        },

        reset: {
          show: true,
          text: '重置',
          props: {
            type: 'primary',
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
              const res = await scope.validateFields([nameProp])
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

    async submitRequest(values) {
      console.log('submit: ', values)
      return false
    },

    validateFail(error) {
      console.log('校验失败: ', error)
    },

    async fetchDictCollection() {
      message.success('获取字典集合数据')
      console.log('fetch dict collection')
      await sleep(5000)
      return {
        status: [
          { statusName: '开启', value: 1 },
          { statusName: '关闭', value: 2 },
        ],
      }
    },
    // toast: false,
  }
})

function handleChangeNameCol() {
  nameCol.value = { span: +nameCol.value.span! + 1 }
}

function handleChangeNameLabel() {
  nameLabel.value = nameLabel.value === '名称' ? 'Name' : '名称'
}

function handleChangeNameType() {
  nameType.value = nameType.value === 'text' ? 'dict-select' : 'text'
}

function handleToggleButtonsShow() {
  buttonsShow.value = !buttonsShow.value
}

function handleToggleConfirmButtonShow() {
  buttonConfirmShow.value = !buttonConfirmShow.value
}
</script>
