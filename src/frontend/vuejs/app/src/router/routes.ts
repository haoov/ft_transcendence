import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import GameView from "@/views/GameView.vue";
import ChatView from "@/views/ChatView.vue";
import type GameSocket from "@/game/gameSocket";
import { inject } from "vue";
import { onBeforeRouteLeave } from "vue-router";

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
		component: GameView,
		beforeEnter: () => {
			const gameSocket: GameSocket = inject('gameSocket') as GameSocket;
			if (!gameSocket.socketIsReady())
				gameSocket.initSocket();
		}
	},
	{
		path: "/chat",
		name: "chat",
		component: ChatView,
		children: [],
	}
];

export default routes;