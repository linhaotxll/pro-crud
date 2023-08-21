<script lang="tsx">
import { Select, Spin } from 'ant-design-vue'
import { computed, defineComponent, h, triggerRef, watch } from 'vue'

import type { InternalProFormColumnOptions } from '../ProForm'
import type { CSSProperties, PropType } from 'vue'

const spinContainerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '8px 0',
}

export default defineComponent({
  name: 'ProSelect',

  props: {
    column: Object as PropType<InternalProFormColumnOptions<any>>,
    value: [String, Number, Array] as PropType<
      string | number | string[] | number[]
    >,
  },

  emits: ['update:value'],

  setup(props, { attrs, emit }) {
    const config = computed(() => {
      const { dict } = props.column!
      const { loading, options } = dict || {}
      return { loading, options }
    })

    const value = computed({
      get: () => props.value,
      set(v) {
        emit('update:value', v)
      },
    })

    // 当 options 变化时，主动追踪 value 的依赖，更新 el-select 中回显的值
    watch(config, () => {
      triggerRef(value)
    })

    return () => {
      return (
        <Select
          {...attrs}
          options={config.value.options?.value ?? []}
          v-model:value={value.value}
        >
          {{
            dropdownRender: (ctx: any) => {
              return config.value.loading?.value ? (
                <div style={spinContainerStyle}>
                  <Spin />
                </div>
              ) : (
                h(ctx.menuNode)
              )
            },
          }}
        </Select>
      )
    }
  },
})
</script>
