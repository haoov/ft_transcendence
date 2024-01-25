import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import GameView from "@/game/GameView.vue";
import ChatView from "@/views/ChatView.vue";
import ProfileView from "@/views/ProfileView.vue";
import SettingView from "@/views/SettingView.vue";
import PageNotFoundView from "@/views/PageNotFoundView.vue";


const routes = [
	{
		path: "/",
		name: "home",
		component: HomeView,
	},
	{
		path: "/login",
		name: "login",
		component: LoginView
	},
	{
		path: "/:username",
		name: "profile",
		component: ProfileView
	},
	{
		path: "/game",
		name: "game",
		component: GameView,
	},
	{
		path: "/chat",
		name: "chat",
		component: ChatView,
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
		name: "errorPath",
		component: PageNotFoundView,
	},
];

export default routes;