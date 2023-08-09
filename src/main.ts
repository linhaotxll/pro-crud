import ElementPlus from 'element-plus'
import { createApp } from 'vue'

import 'element-plus/dist/index.css'
import './index.css'
import App from './App.vue'
import BasicDialog from './components/BasicDialog.vue'
import { router } from './routes'

import { ProComponents } from '~/index'

const app = createApp(App)

app.component(BasicDialog.name, BasicDialog)

app.use(ElementPlus, {})

app.use(ProComponents, {})

app.use(router)

app.mount('#app')
