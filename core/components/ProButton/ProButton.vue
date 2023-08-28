<script lang="tsx">
import { Button, Modal, Popconfirm } from 'ant-design-vue'
import { defineComponent } from 'vue'

import { ProRender } from '../ProRender'

import type {
  ActionConfirmProps,
  ActionModalProps,
  ActionOption,
} from './interface'
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
    const [modal, contextHolder] = Modal.useModal()

    return () => {
      const ContextHolder = contextHolder()
      const config = props.config
      if (!config) {
        return null
      }

      const { onClick: originClick, ...rest } = config.props ?? {}

      const $inner = config.render ? (
        <ProRender render={config.render} />
      ) : (
        <>
          {/* @ts-ignore */}
          <ContextHolder />
          <Button {...rest} onClick={handleClickButton}>
            {config.text}
          </Button>
        </>
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
          modal.confirm(config.confirmProps as ActionModalProps)
          return
        }

        if (config.confirmType === false) {
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
</script>
