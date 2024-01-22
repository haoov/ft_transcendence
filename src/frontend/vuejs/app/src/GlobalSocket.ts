import { ClientEvents, ServerEvents, type User } from "@/utils";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import notify from "./notify/notify";

class GlobalSocket {
	private readonly socket: Socket
	private socketReady: boolean;

	constructor() {
		this.socket = io(`http://${import.meta.env.VITE_HOSTNAME}:3000/users`);
		this.socketReady = false;
	}

	async initSocket() {
		await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/me`).then((response) => {
			this.socket.emit(ClientEvents.connected, response.data);
		});
		this.socket.on(ServerEvents.gameReady, (data: User) => {
			notify.newNotification("gameReady", { by: data.username });
		})
		this.socket.on(ServerEvents.gameInvite, (data: User) => {
			notify.newNotification("gameInvite", { by: data.username });
		});
		this.socketReady = true;
	}

	getSocket(): Socket {
		return this.socket;
	}

	socketIsReady(): boolean {
		return this.socketReady;
	}
}

export default GlobalSocket;