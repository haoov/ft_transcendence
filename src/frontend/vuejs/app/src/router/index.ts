import { createRouter, createWebHistory, onBeforeRouteLeave } from 'vue-router'
import routes from './routes'
import axios from 'axios';
import { inject } from 'vue';
import { type SocketManager } from '@/SocketManager';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
});

router.beforeEach((to) => {
	if (to.name != "login") {
		const socketManager: SocketManager = inject('socketManager') as SocketManager;
		const $data: any = inject('$data');
		axios(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/auth`, {
			method: "get",
		}).then(
			() => {
				if (socketManager.disconnected()) {
					console.log("checking auth");
					socketManager.initSocket();
				}
				if (!$data.isSocketReady()) {
					$data.initSocket();
				}
			},
			() => {
				router.push("/login");
			}
		);
	}
})

export default router
