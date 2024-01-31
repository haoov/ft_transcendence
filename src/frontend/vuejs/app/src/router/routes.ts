import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import GameView from "@/game/GameView.vue";
import ChatView from "@/views/Chat2View.vue";
import ProfileView from "@/views/ProfileView.vue";
import SettingView from "@/views/SettingView.vue";
import PageNotFoundView from "@/views/PageNotFoundView.vue";
import { socketManager } from "@/SocketManager";


const routes = [
	{
		path: "/",
		name: "home",
		component: HomeView,
		beforeEnter: async () => {
			if (socketManager.getUser().id == undefined) {
				await socketManager.initSocket();
				console.log("init socket");
			}
		},
	},
	{
		path: "/login",
		name: "login",
		component: LoginView
	},
	{
		path: "/:username",
		name: "profile",
		component: ProfileView,
		beforeEnter: async () => {
			if (socketManager.getUser().id == undefined) {
				await socketManager.initSocket();
				console.log("init socket");
			}
		},
	},
	{
		path: "/game",
		name: "game",
		component: GameView,
		beforeEnter: async () => {
			if (socketManager.getUser().id == undefined) {
				await socketManager.initSocket();
				console.log("init socket");
			}
		},
	},
	{
		path: "/chat",
		name: "chat",
		component: ChatView,
		beforeEnter: async () => {
			if (socketManager.getUser().id == undefined) {
				await socketManager.initSocket();
				console.log("init socket");
			}
		},
	},
	{
		path: "/settings",
		name: "settings",
		component: SettingView,
	},
	{
		path: "/error",
		name: "error",
		component: PageNotFoundView,
	},
	{
		path: "/:pathMatch(.*)*",
		redirect: () => { return { path: '/error' }}
	},
];

export default routes;