import { ClientEvents, ServerEvents, type User } from "@/utils";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import notify from "./notify/notify";
import router from "./router";
import { reactive } from "vue";
import type { GameParams } from "./game/interfaces";

class SocketManager {
	private readonly userSocket: Socket;
	private readonly gameSocket: Socket;
	private user: User;

	constructor() {
		this.userSocket = io(`http://${import.meta.env.VITE_HOSTNAME}:3000/users`);
		this.gameSocket = io(`http://${import.meta.env.VITE_HOSTNAME}:3000/game`);
		this.user = {} as User;
	}

	async initSocket() {
		await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/me`).then((response) => {
			this.user = reactive(response.data);
			this.userSocket.emit(ClientEvents.connected, response.data);
			this.gameSocket.emit(ClientEvents.connected, response.data);
		});

		this.userSocket.on(ServerEvents.dataChanged, (data: User) => {
			if (data.id == this.user.id) {
				this.user = data;
			}
		});

		this.userSocket.on(ServerEvents.gameReady, (data: User) => {
			if (data.id != this.user.id)
				notify.newNotification("gameReady", { by: data.username });
		});

		this.userSocket.on(ServerEvents.gameInvite, (data: User) => {
			const accept = () => {
				this.gameSocket.emit(ClientEvents.gameResponse, {accepted: true, opponent: data});
				router.push("/game");
			}
			const decline = () => {
				this.userSocket.emit(ClientEvents.gameResponse, {accepted: false, opponent: data});
			}
			notify.newNotification("gameInvite", {
				by: data.username,
				buttons: [
					{action: accept},
					{action: decline}
				]});
		});
	}

	addEventListener(socket: "user" | "game", event: string, callback: (...args: any[]) => void) {
		if (socket == "user")
			this.userSocket.on(event, callback);
		else if (socket == "game")
			this.gameSocket.on(event, callback);
	}

	removeEventListener(socket: "user" | "game", event: string, callback: (...args: any[]) => void) {
		if (socket == "user")
			this.userSocket.off(event, callback);
		else if (socket == "game")
			this.gameSocket.off(event, callback);
	}

	hasEventListener(socket: "user" | "game", event: string): boolean {
		if (socket == "user")
			return this.userSocket.hasListeners(event);
		else if (socket == "game")
			return this.gameSocket.hasListeners(event);
		return false;
	}

	getUser(): User {
		return this.user;
	}

	selectParams(params: GameParams) {
		this.gameSocket.emit(ClientEvents.gameParams, params);
	}

	stopWaiting() {
		this.gameSocket.emit(ClientEvents.stopWaiting);
	}

	update() {
		this.gameSocket.emit(ClientEvents.update);
	}

	play() {
		this.gameSocket.emit(ClientEvents.gamePlay);
	}

	forfeit() {
		this.gameSocket.emit(ClientEvents.gameForfeit);
	}
	
	invite(opponentId: number) {
		this.userSocket.emit(ClientEvents.gameInvite, opponentId);
	}

	useSpell(spell: string) {
		this.gameSocket.emit(ClientEvents.useSpell, spell);
	}

	move(direction: string) {
		this.gameSocket.emit(ClientEvents.move, direction);
	}

	disconnected(): boolean {
		return this.userSocket.disconnected && this.gameSocket.disconnected;
	}
}

const socketManager = new SocketManager();

export { socketManager, SocketManager };