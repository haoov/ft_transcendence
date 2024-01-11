import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import $data from './chatdata'
import { io, type Socket } from 'socket.io-client'
import axios from 'axios'
import { ClientEvents } from './utils'

const app = createApp(App)

app.use(router)
app.provide('$data', $data)
app.mount('#app')

async function connectSocket(): Promise<Socket> {
	const socket: Socket = io("http://localhost:3000/users");
	await axios.get("http://localhost:3000/api/user/me").then((response) => {
		socket.emit(ClientEvents.connected, response.data);
	});
	return socket;
}

app.provide('socket', connectSocket);
