import { get, set } from 'lodash-es'
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  toRaw,
  toValue,
} from 'vue'

import { mergeWithTovalue, type ValueTypeForm } from '../common'
import { buildCustomRender } from '../CustomRender'

import type { InternalProFormColumnOptions, ProFormScope } from './interface'
import type { NamePath, ValueTypeFormProps } from '../common'
import type { CSSProperties, MaybeRefOrGetter, PropType } from 'vue'

export const ProFormField = defineComponent({
  name: 'ProFormField',

  props: {
    column: {
      type: Object as PropType<
        MaybeRefOrGetter<InternalProFormColumnOptions<any>>
      >,
      required: true,
    },
    scope: Object as PropType<ProFormScope<any>>,
    field: {
      type: Object as PropType<ValueTypeForm>,
      required: true,
    },
    // index: Number as PropType<number | undefined>,
    name: [String, Array] as PropType<NamePath>,
  },

  setup(props) {
    const vModelValue = computed({
      set(newValue: any) {
        const name = props.name
        if (name) {
          const values = props.scope?.getFormValues()
          if (values) {
            set(values, name, newValue)
          }
        }
      },
      get() {
        const values = props.scope?.getFormValues()
        const name = props.name
        return values && name ? get(values, name) : undefined
      },
    })

    // 不需要保留字段时,卸载前将字段删除,重新添加时将字段设置
    if (!toValue(props.column).preserve) {
      onBeforeUnmount(() => {
        props.scope?.removeFields(toValue(props.column).name)
      })
      onBeforeMount(() => {
        const name = toValue(props.column).name
        if (props.scope?.getFieldValue(name) === undefined) {
          props.scope?.reset([name])
        }
      })
    }

    return () => {
      const columnValue = toValue(props.column)

      const { context: fieldProps, vModelName = 'value' } = props.field!

      const style: CSSProperties | undefined = columnValue.fill
        ? { width: '100%' }
        : undefined

      const slots = columnValue.fieldSlots
        ? Object.entries(columnValue.fieldSlots).reduce<Record<string, any>>(
            (prev, [slotName, slotFn]) => {
              prev[slotName] = (...args: any) => slotFn(...args, columnValue)
              return prev
            },
            {}
          )
        : undefined

      const mergeProps: ValueTypeFormProps = mergeWithTovalue(
        {
          [vModelName]: vModelValue.value,
          [`onUpdate:${vModelName}`]: (newValue: any) => {
            return (vModelValue.value = newValue)
          },
          style,
          column: columnValue,
          scope: props.scope,
          slots,
          ref: toRaw(columnValue).instance,
        },
        toValue(fieldProps),
        toValue(props.column)?.fieldProps
      )

      return buildCustomRender({
        ...props.field,
        context: mergeProps,
      })
    }
  },
})
