import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import $data from '@/utils/chatdata'
import SocketManager from './SocketManager'

const app = createApp(App)

app.use(router)
app.provide('$data', $data)
app.provide('socketManager', new SocketManager())
app.mount('#app')
