import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import GameView from "@/views/GameView.vue";
import PlayView from "@/views/PlayView.vue";

const routes = [
	{
		path: "/",
		name: "home",
		component: HomeView
	},
	{
		path: "/login",
		name: "login",
		component: LoginView
	},
	{
		path: "/game",
		name: "game",
		component: GameView
	},
];

export default routes;