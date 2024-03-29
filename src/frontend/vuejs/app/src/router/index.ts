import { createRouter, createWebHistory, onBeforeRouteLeave } from 'vue-router'
import routes from './routes'
import axios from 'axios';
import { socketManager } from '@/SocketManager';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
});

router.beforeEach((to) => {
	if (to.name != "login") {
		axios(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/auth`, {
			method: "get",
		}).then(
			async () => {},
			() => {
				router.push("/login");
			}
		)
		.catch(err => {});
	}
})

export default router
