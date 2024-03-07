import {
  computed,
  defineComponent,
  h,
  onBeforeMount,
  onBeforeUnmount,
  resolveComponent,
  toValue,
} from 'vue'

import { mergeWithTovalue, type ValueTypeForm } from '../common'

import type { InternalProFormColumnOptions, ProFormScope } from './interface'
import type { CSSProperties, PropType, Ref } from 'vue'

export const ProFormField = defineComponent({
  name: 'ProFormField',

  props: {
    column: {
      type: Object as PropType<Ref<InternalProFormColumnOptions<any>>>,
      required: true,
    },
    scope: Object as PropType<ProFormScope<any>>,
    field: {
      type: Object as PropType<ValueTypeForm<any>>,
      required: true,
    },
  },

  setup(props) {
    const vModelValue = computed({
      set(newValue: any) {
        const name = props.column?.value.name
        if (name) {
          props.scope?.setFieldValue(name, newValue)
        }
      },
      get() {
        const name = props.column?.value.name
        return name ? props.scope?.getFieldValue(name) : undefined
      },
    })

    // 不需要保留字段时,卸载前将字段删除,重新添加时将字段设置
    if (!toValue(props.column).preserve) {
      onBeforeUnmount(() => {
        props.scope?.removeFields(toValue(props.column).name)
      })
      onBeforeMount(() => {
        props.scope?.reset([toValue(props.column).name])
        // props.scope?.setFieldValue(
        //   toValue(props.column).name,
        //   props.scope.getFormValues()[toValue(props.column).name]
        // )
      })
    }

    return () => {
      const columnValue = toValue(props.column)

      console.log('render pro field: ')
      const {
        is,
        props: fieldProps,
        render,
        vModelName = 'value',
      } = props.field!

      const style: CSSProperties | undefined = columnValue.fill
        ? { width: '100%' }
        : undefined

      const mergeProps = mergeWithTovalue(
        {
          [vModelName]: vModelValue.value,
          [`onUpdate:${vModelName}`]: (newValue: any) =>
            (vModelValue.value = newValue),
          style,
        },
        toValue(fieldProps),
        toValue(props.column)?.fieldProps
      )

      if (typeof render === 'function') {
        return render({ vModel: vModelValue, column: columnValue })
      }

      const slots = columnValue.fieldSlots
        ? Object.entries(columnValue.fieldSlots).reduce<Record<string, any>>(
            (prev, [slotName, slotFn]) => {
              prev[slotName] = (...args: any) => slotFn(...args, columnValue)
              return prev
            },
            {}
          )
        : undefined

      return h(resolveComponent(is), mergeProps, slots)
    }
  },
})
