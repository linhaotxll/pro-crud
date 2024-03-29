import { Col, Form, Row } from 'ant-design-vue'
import { defineComponent, toValue } from 'vue'

import { ProFormItem } from './ProFormItem'

import { ProButtonGroup } from '../ProButton'

import type { BuildFormBinding, ProFormScope } from './interface'
import type { FormInstance, FormProps, RowProps } from 'ant-design-vue'
import type { ComputedRef, PropType, Ref } from 'vue'

export const ProForm = defineComponent({
  name: 'ProForm',

  props: {
    row: Object as PropType<ComputedRef<RowProps>>,
    formProps: Object as PropType<ComputedRef<FormProps>>,
    values: Object,
    columns: Object as PropType<BuildFormBinding<any>['columns']>,
    actionGroup: Object as PropType<BuildFormBinding<any>['actionGroup']>,
    formRef: Object as PropType<Ref<FormInstance | null>>,
    scope: Object as PropType<ProFormScope<any>>,
  },

  setup(props, { expose }) {
    expose(props.scope)

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
        <Form
          {...toValue(props.formProps)}
          model={props.values}
          ref={props.formRef}
        >
          {
            <Row {...toValue(props.row)}>
              {toValue(props.columns)?.map(column => (
                <ProFormItem column={column} scope={props.scope} />
              ))}
              {$action}
            </Row>
          }
        </Form>
      )
    }
  },
})
