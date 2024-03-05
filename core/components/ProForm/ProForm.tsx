import { Col, Form, Row } from 'ant-design-vue'
import { defineComponent, toValue } from 'vue'

import { ProFormItem } from './ProFormItem'

import { ProButtonGroup } from '../ProButton'

import type { BuildFormBinding } from './interface'
import type { FormProps, RowProps } from 'ant-design-vue'
import type { ComputedRef, PropType } from 'vue'

export const ProForm = defineComponent({
  name: 'ProForm',

  props: {
    row: Object as PropType<ComputedRef<RowProps>>,
    formProps: Object as PropType<ComputedRef<FormProps>>,
    values: Object,
    columns: Object as PropType<BuildFormBinding<any>['columns']>,
    actionGroup: Object as PropType<BuildFormBinding<any>['actionGroup']>,
  },

  setup(props) {
    return () => {
      console.log('render pro form: ')

      // 按钮组
      const actionGroupValue = toValue(props.actionGroup)
      const $action = actionGroupValue?.show ? (
        <Col {...actionGroupValue.col}>
          <ProButtonGroup action={actionGroupValue} />
        </Col>
      ) : null

      return (
        <Form {...toValue(props.formProps)} model={props.values}>
          {
            <Row {...toValue(props.row)}>
              {toValue(props.columns)?.map(column => (
                <ProFormItem column={column} />
              ))}
              {$action}
            </Row>
          }
        </Form>
      )
    }
  },
})
