<template>
  <div>
    <pro-form ref="proFormRef" v-bind="proFormBinding" />
  </div>
</template>

<script lang="tsx" setup>
// import { ref } from 'vue'

import { buildForm } from '~/components/ProForm'

// import type { ColProps, FormProps, RowProps } from 'ant-design-vue'

// const sleep = (time = 2000) => new Promise(r => setTimeout(r, time))

// const fetchStatusData = async () => {
//   await sleep()
//   return [
//     { statusName: '启用', value: 1 },
//     { statusName: '禁用', value: 2 },
//   ]
// }

interface FormValues {
  name: string
  cascader: string
}

// const formProps = ref<FormProps>({
//   // labelWidth: '100px',
//   // onValidate(p, v, m) {
//   //   console.log('field change: ', p, v, m)
//   // },
// })
// const row = ref<Partial<RowProps>>({ gutter: 8 })
// const col = ref<Partial<ColProps>>({ span: 24 })

// const nameCol = ref<Partial<ColProps>>({ span: 4 })
// const nameLabel = ref('名称')
// // const nameType = ref<ValueType>('auto-complete')

// const buttonsShow = ref(true)
// const buttonConfirmShow = ref(true)
// const nameProp = ['info', 'name']

const { proFormBinding, proFormRef } = buildForm<FormValues>(scope => {
  return {
    initialValues: {
      name: '文本内容2',
      cascader: 'guide,disciplines,consistency',
    },

    formProps: {
      labelCol: { span: 4 },
    },

    columns: [
      {
        label: '文本',
        name: 'name',
        type: 'text',
        tooltip: '姓名',
        itemProps: {
          rules: { required: true, message: '请填写名称' },
        },
        itemSlots: {},
        fieldProps: {
          allowClear: true,
          onBlur() {
            console.log('el-input blur')
          },
          onFocus() {
            console.log('el-input focus')
          },
          onChange() {
            console.log('el-input change')
          },
          onInput() {
            console.log('el-input input')
          },
          onClear() {
            console.log('el-input clear')
          },
        },
        fieldSlots: {
          prefix: () => <span>prefix</span>,
          suffix: () => <span>suffix</span>,
          prepend: () => <span>prepend</span>,
          append: () => <span>append</span>,
        },
      },
      // {
      //   label: '自动补全',
      //   name: 'auto',
      //   type: 'auto-complete',
      //   itemProps: {
      //     rules: { required: true, message: '请填写' },
      //   },
      //   fieldProps: {
      //     // valueKey: 'key',
      //     // fetchSuggestions(_, cb) {
      //     //   sleep().then(() => {
      //     //     cb([
      //     //       { label: '一', key: 1 },
      //     //       { label: '二', key: 2 },
      //     //     ])
      //     //   })
      //     // },
      //   },
      //   // fieldSlots: {
      //   //   default: () => {
      //   //     // console.log(ctx.item)
      //   //     return <span>2</span>
      //   //   },
      //   //   prefix: () => <span>prefix</span>,
      //   //   suffix: () => <span>suffix</span>,
      //   //   prepend: () => <span>prepend</span>,
      //   //   append: () => <span>append</span>,
      //   // },
      // },
      {
        label: '级联',
        name: 'cascader',
        type: 'cascader',
        itemProps: {
          // rules: { required: true, message: '请填写' },
        },
        fieldProps: {
          options: [
            {
              value: 'guide',
              label: 'Guide',
              children: [
                {
                  value: 'disciplines',
                  label: 'Disciplines',
                  children: [
                    {
                      value: 'consistency',
                      label: 'Consistency',
                    },
                    {
                      value: 'feedback',
                      label: 'Feedback',
                    },
                    {
                      value: 'efficiency',
                      label: 'Efficiency',
                    },
                    {
                      value: 'controllability',
                      label: 'Controllability',
                    },
                  ],
                },
                {
                  value: 'navigation',
                  label: 'Navigation',
                  children: [
                    {
                      value: 'side nav',
                      label: 'Side Navigation',
                    },
                    {
                      value: 'top nav',
                      label: 'Top Navigation',
                    },
                  ],
                },
              ],
            },
            {
              value: 'component',
              label: 'Component',
              children: [
                {
                  value: 'basic',
                  label: 'Basic',
                  children: [
                    {
                      value: 'layout',
                      label: 'Layout',
                    },
                    {
                      value: 'color',
                      label: 'Color',
                    },
                    {
                      value: 'typography',
                      label: 'Typography',
                    },
                    {
                      value: 'icon',
                      label: 'Icon',
                    },
                    {
                      value: 'button',
                      label: 'Button',
                    },
                  ],
                },
                {
                  value: 'form',
                  label: 'Form',
                  children: [
                    {
                      value: 'radio',
                      label: 'Radio',
                    },
                    {
                      value: 'checkbox',
                      label: 'Checkbox',
                    },
                    {
                      value: 'input',
                      label: 'Input',
                    },
                    {
                      value: 'input-number',
                      label: 'InputNumber',
                    },
                    {
                      value: 'select',
                      label: 'Select',
                    },
                    {
                      value: 'cascader',
                      label: 'Cascader',
                    },
                    {
                      value: 'switch',
                      label: 'Switch',
                    },
                    {
                      value: 'slider',
                      label: 'Slider',
                    },
                    {
                      value: 'time-picker',
                      label: 'TimePicker',
                    },
                    {
                      value: 'date-picker',
                      label: 'DatePicker',
                    },
                    {
                      value: 'datetime-picker',
                      label: 'DateTimePicker',
                    },
                    {
                      value: 'upload',
                      label: 'Upload',
                    },
                    {
                      value: 'rate',
                      label: 'Rate',
                    },
                    {
                      value: 'form',
                      label: 'Form',
                    },
                  ],
                },
                {
                  value: 'data',
                  label: 'Data',
                  children: [
                    {
                      value: 'table',
                      label: 'Table',
                    },
                    {
                      value: 'tag',
                      label: 'Tag',
                    },
                    {
                      value: 'progress',
                      label: 'Progress',
                    },
                    {
                      value: 'tree',
                      label: 'Tree',
                    },
                    {
                      value: 'pagination',
                      label: 'Pagination',
                    },
                    {
                      value: 'badge',
                      label: 'Badge',
                    },
                  ],
                },
                {
                  value: 'notice',
                  label: 'Notice',
                  children: [
                    {
                      value: 'alert',
                      label: 'Alert',
                    },
                    {
                      value: 'loading',
                      label: 'Loading',
                    },
                    {
                      value: 'message',
                      label: 'Message',
                    },
                    {
                      value: 'message-box',
                      label: 'MessageBox',
                    },
                    {
                      value: 'notification',
                      label: 'Notification',
                    },
                  ],
                },
                {
                  value: 'navigation',
                  label: 'Navigation',
                  children: [
                    {
                      value: 'menu',
                      label: 'Menu',
                    },
                    {
                      value: 'tabs',
                      label: 'Tabs',
                    },
                    {
                      value: 'breadcrumb',
                      label: 'Breadcrumb',
                    },
                    {
                      value: 'dropdown',
                      label: 'Dropdown',
                    },
                    {
                      value: 'steps',
                      label: 'Steps',
                    },
                  ],
                },
                {
                  value: 'others',
                  label: 'Others',
                  children: [
                    {
                      value: 'dialog',
                      label: 'Dialog',
                    },
                    {
                      value: 'tooltip',
                      label: 'Tooltip',
                    },
                    {
                      value: 'popover',
                      label: 'Popover',
                    },
                    {
                      value: 'card',
                      label: 'Card',
                    },
                    {
                      value: 'carousel',
                      label: 'Carousel',
                    },
                    {
                      value: 'collapse',
                      label: 'Collapse',
                    },
                  ],
                },
              ],
            },
            {
              value: 'resource',
              label: 'Resource',
              children: [
                {
                  value: 'axure',
                  label: 'Axure Components',
                },
                {
                  value: 'sketch',
                  label: 'Sketch Templates',
                },
                {
                  value: 'docs',
                  label: 'Design Documentation',
                },
              ],
            },
          ],
        },
        fieldSlots: {
          // default: ctx => {
          //   console.log(ctx.item)
          //   return <span>2</span>
          // },
          // prefix: () => <span>prefix</span>,
          // suffix: () => <span>suffix</span>,
          // prepend: () => <span>prepend</span>,
          // append: () => <span>append</span>,
        },
        transform: {
          to(formValue: string[]) {
            // debugger
            return formValue.join(',')
          },
          from(serverValue: string | undefined) {
            // debugger
            return serverValue?.split(',') ?? []
          },
        },
      },
    ],
    buttons: {
      show: true,
      list: {
        set: {
          show: true,
          text: '从服务端获取数据',
          props: {
            onClick() {
              // debugger
              // scope.setFieldValue('name', 'aaa')
              scope.setFieldValuesTransform({
                cascader: 'guide,disciplines,feedback',
                // auto: 2,
              })
            },
          },
        },
      },
    },

    async submitRequest(values) {
      console.log('submit: ', values)
      return true
    },
  }
})
</script>
