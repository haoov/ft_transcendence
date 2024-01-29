import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import $data from '@/components/chat/chatdata'
import { socketManager } from './SocketManager'

const app = createApp(App)

app.use(router)
app.provide('$data', $data)
socketManager.initSocket();
app.mount('#app')
