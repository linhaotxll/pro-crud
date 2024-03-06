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
    const value = computed({
      get: () => props.value,
      set(v) {
        emit('update:value', v)
      },
    })

    // 当 options 变化时，主动追踪 value 的依赖，更新 el-select 中回显的值
    watch(
      () => props.column?.dict,
      () => {
        triggerRef(value)
      }
    )

    return () => {
      const { options, loading } = props.column?.dict ?? {}
      return (
        <Select
          {...attrs}
          options={options.value}
          loading={loading.value}
          v-model:value={value.value}
        >
          {{
            dropdownRender: (ctx: any) => {
              return loading.value ? (
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
