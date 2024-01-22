import { createRouter, createWebHistory, onBeforeRouteLeave } from 'vue-router'
import routes from './routes'
import axios from 'axios';
import { inject } from 'vue';
import SocketManager from '@/SocketManager';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
});

router.beforeEach((to) => {
	if (to.name != "login") {
		const socketManager: SocketManager = inject('socketManager') as SocketManager;
		axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/auth`).then(
			() => {
				if (socketManager.disconnected())
					socketManager.initSocket();
			},
			() => {
				router.push("/login");
			}
		);
	}
})

export default router
