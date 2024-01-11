import { createRouter, createWebHistory, onBeforeRouteLeave } from 'vue-router'
import routes from './routes'
import axios from 'axios';
import { inject } from 'vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
});

router.beforeEach((to) => {
	if (to.name != "login") {
		const connectSocket: any = inject('socket');
		axios.get("http://localhost:3000/api/auth").then(
			//onSuccess
			() => {
				connectSocket();
			},
			//onFailure
			() => {
				router.push("/login");
			}
		);
	}
})

export default router
