<script lang="tsx">
import { Button, Modal, Popconfirm } from 'ant-design-vue'
import { defineComponent } from 'vue'

import { ProRender } from '../ProRender'

import type { ActionConfirmProps, ActionOption } from './interface'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'ProButton',

  props: {
    config: {
      type: Object as PropType<ActionOption>,
      required: true,
    },
  },

  setup(props) {
    return () => {
      const config = props.config
      if (!config) {
        return null
      }

      const $inner = config.render ? (
        <ProRender render={config.render} />
      ) : (
        <Button {...config.props} onClick={handleClickButton}>
          {config.text}
        </Button>
      )

      const $wrapper =
        config.confirmType === 'popconfirm' ? (
          <Popconfirm {...(config.confirmProps as ActionConfirmProps)}>
            {$inner}
          </Popconfirm>
        ) : (
          $inner
        )

      function handleClickButton(e: MouseEvent) {
        if (config.confirmType === 'modal') {
          Modal.confirm({
            ...config.confirmProps,
          })
          return
        }

        if (config.confirmType === false) {
          const originClick = config.props?.onClick
          if (typeof originClick === 'function') {
            originClick(e)
          } else if (Array.isArray(originClick)) {
            originClick.forEach(onClick => onClick(e))
          }
          return
        }
      }

      return $wrapper
    }
  },
})

// defineOptions({ name: 'ProButtons' })

// defineProps<{
//   config: ActionOption
// }>()
</script>
