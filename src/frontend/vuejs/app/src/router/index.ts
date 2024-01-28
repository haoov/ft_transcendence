import { createRouter, createWebHistory, onBeforeRouteLeave } from 'vue-router'
import routes from './routes'
import axios from 'axios';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
});

router.beforeEach((to) => {
	if (to.name != "login") {
		axios(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/auth`, {
			method: "get",
			//withCredentials: true,
		}).then(
			() => {
			},
			() => {
				router.push("/login");
			}
		);
	}
})

export default router
