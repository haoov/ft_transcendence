import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import $data from '@/utils/chatdata'
import GlobalSocket from './GlobalSocket'
import GameSocket from '@/game/gameSocket'

const app = createApp(App)

app.use(router)
app.provide('$data', $data)
app.provide('globalSocket', new GlobalSocket())
app.provide('gameSocket', new GameSocket())
app.mount('#app')
