<script lang="ts">
import { defineComponent } from 'vue'

import type { JSXElement } from '../common'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'ProRender',

  props: {
    render: Function as PropType<(...args: any[]) => JSXElement>,

    ctx: null,
  },

  setup(props) {
    return () => {
      return props.render?.(props.ctx) ?? null
    }
  },
})
</script>
