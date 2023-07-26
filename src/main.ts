import ElementPlus from 'element-plus'
import { createApp } from 'vue'

import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import { router } from './routes'

import { ProComponents } from '~/index'

const app = createApp(App)

app.use(ElementPlus)

app.use(ProComponents, {})

app.use(router)

app.mount('#app')
