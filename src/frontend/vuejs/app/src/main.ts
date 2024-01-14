import './assets/main.css'
import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import $data from './chatdata'

const app = createApp(App)

app.use(router)
app.provide('$data', $data)
app.provide('displayNotif', ref(false));
app.mount('#app')
