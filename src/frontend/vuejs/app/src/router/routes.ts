import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import TwofaView from "@/views/TwofaView.vue";


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
		path: "/twofa",
		name: "twofa",
		component: TwofaView
	}
];

export default routes;