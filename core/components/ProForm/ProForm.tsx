import { Col, Form, Row } from 'ant-design-vue'
import { defineComponent } from 'vue'

import { ProFormItem } from './ProFormItem'

import { toValueWithCtx } from '../common'
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
    isInlineLayout: Object as PropType<BuildFormBinding<any>['isInlineLayout']>,
  },

  setup(props, { expose }) {
    expose(props.scope)

    return () => {
      // console.log('render pro form: ')

      // 按钮组
      const actionGroupValue = toValueWithCtx(props.actionGroup)
      const $action = actionGroupValue?.show ? (
        <Col {...actionGroupValue.col}>
          <ProButtonGroup action={actionGroupValue} />
        </Col>
      ) : null

      const $content = (
        <>
          {toValueWithCtx(props.columns)?.map(column => (
            <ProFormItem column={column} scope={props.scope} />
          ))}
          {$action}
        </>
      )

      const formProps = toValueWithCtx(props.formProps)

      return (
        <Form {...formProps} model={props.values} ref={props.formRef}>
          {toValueWithCtx(props.isInlineLayout) ? (
            $content
          ) : (
            <Row {...toValueWithCtx(props.row)}>{$content}</Row>
          )}
        </Form>
      )
    }
  },
})
