import { createRouter, createWebHistory, onBeforeRouteLeave } from 'vue-router'
import routes from './routes'
import axios from 'axios';
import { inject } from 'vue';
import GlobalSocket from '@/GlobalSocket';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
});

router.beforeEach((to) => {
	if (to.name != "login") {
		const globalSocket: GlobalSocket = inject('globalSocket') as GlobalSocket;
		axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/auth`).then(
			() => {
				if (!globalSocket.socketIsReady()) {
					console.log("init socket");
					globalSocket.initSocket();
				}
			},
			() => {
				router.push("/login");
			}
		);
	}
})

export default router
