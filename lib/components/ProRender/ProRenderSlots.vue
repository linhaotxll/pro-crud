<script lang="ts">
import { defineComponent } from 'vue'

import type { InternalProFormColumnOptions } from '../ProForm'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'ProRenderSlots',

  props: {
    column: Object as PropType<InternalProFormColumnOptions>,
  },

  setup(props) {
    return () => {
      const slots = props.column?.fieldSlots ?? null
      if (!slots || !Object.keys(slots).length) {
        return null
      }

      return {}
    }
  },
})
</script>
