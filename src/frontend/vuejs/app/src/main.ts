import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import $data from './chatdata'

const app = createApp(App)

app.use(router)
app.provide('$data', $data)
app.mount('#app')
