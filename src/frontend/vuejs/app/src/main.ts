import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { socketManager } from './SocketManager'

const app = createApp(App)

app.use(router)
app.mount('#app')
