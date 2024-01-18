import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import axios from 'axios';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
});

router.beforeEach(async (to) => {
	if (to.name != "login" && to.name != "twofa")
		await axios.get("http://localhost:3000/api/auth")
			.catch(() => { router.push("/login");});
})

export default router
