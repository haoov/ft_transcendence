import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import ChatView from "@/views/ChatView.vue";

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
		path: "/chat",
		name: "chat",
		component: ChatView,
		children: [],
	}
];

export default routes;