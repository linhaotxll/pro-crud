import { defineComponent, h, resolveComponent, toValue } from 'vue'

import type { DictionaryType } from './ensureDictionary'
import type { ValueTypeFormProps } from '../common'
import type { PropType } from 'vue'

export const ProDictionary = defineComponent({
  name: 'ProDictionary',

  props: {
    is: {
      type: String as PropType<DictionaryType>,
      required: true,
    },
    ctx: {
      type: Object as PropType<ValueTypeFormProps>,
      required: true,
    },
  },

  setup(props) {
    return () => {
      const { is, ctx } = props
      const {
        column: { dictionary: { dictionary, loading } = {} },
      } = ctx

      return h(
        resolveComponent(`a-${is}`),
        {
          ...ctx,
          options: toValue(dictionary),
          loading: toValue(loading),
        },
        ctx.slots
      )
    }
  },
})
