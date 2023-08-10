import ElementPlus, { ElInput } from 'element-plus'
import { createApp } from 'vue'

import 'element-plus/dist/index.css'
import './index.css'
import App from './App.vue'
import BasicDialog from './components/BasicDialog.vue'
import BasicInfo from './components/BasicInfo.vue'
import { router } from './routes'

import { ProComponents } from '~/index'

const app = createApp(App)

app.component(BasicDialog.name, BasicDialog)
app.component(BasicInfo.name, BasicInfo)

app.use(ElementPlus, {})

app.use(ProComponents, {
  types: {
    info: {
      form: {
        is: 'basic-info',
      },
    },

    nickname: {
      form: {
        render: ({ vModel }) => {
          return <ElInput v-model={vModel.value} />
        },
      },
    },
  },
})

app.use(router)

app.mount('#app')
