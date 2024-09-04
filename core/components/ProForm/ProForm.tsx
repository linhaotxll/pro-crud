import { defineComponent, toValue } from 'vue'

import { ProFormItem } from './ProFormItem'

import { buildCustomRender, type CustomRender } from '../CustomRender'
import { ProButtonGroup } from '../ProButton'

import type {
  BuildFormBinding,
  CustomRenderFormWrapContext,
  ProFormScope,
} from './interface'
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
    wrap: Object as PropType<CustomRender<CustomRenderFormWrapContext>>,
  },

  setup(props, { expose }) {
    expose(props.scope)

    return () => {
      // console.log('render pro form: ')

      // 按钮组
      const actionGroupValue = toValue(props.actionGroup)
      const $action = actionGroupValue?.show ? (
        <a-col {...actionGroupValue.col}>
          <ProButtonGroup action={actionGroupValue} />
        </a-col>
      ) : null

      const $items = toValue(props.columns)?.map(column => (
        <ProFormItem column={column} scope={props.scope} />
      ))

      const wrapContext: CustomRenderFormWrapContext = {
        $action,
        $items,
      }

      const formProps = toValue(props.formProps)

      const isInlineLayout = toValue(props.isInlineLayout)

      const $content = buildCustomRender<CustomRenderFormWrapContext>({
        render: ctx =>
          isInlineLayout ? (
            <>
              {ctx.$items}
              {ctx.$action}
            </>
          ) : (
            <a-row {...toValue(props.row)}>
              {ctx.$items}
              {ctx.$action}
            </a-row>
          ),
        ...props.wrap,
        context: wrapContext,
      })

      return (
        <a-form {...formProps} model={props.values} ref={props.formRef}>
          {$content}
        </a-form>
      )
    }
  },
})
