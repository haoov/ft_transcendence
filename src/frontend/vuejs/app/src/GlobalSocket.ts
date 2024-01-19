import { ClientEvents, ServerEvents } from "@/utils";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import { reactive } from "vue";

interface INotifications {
	gameReady: boolean;
}

type INotificationsKey = keyof INotifications;

class GlobalSocket {
	private readonly socket: Socket
	private socketReady: boolean;
	private readonly notifications: INotifications;

	constructor() {
		this.socket = io(`http://${import.meta.env.VITE_HOSTNAME}:3000/users`);
		this.socketReady = false;
		this.notifications = reactive({gameReady: false});
	}

	async initSocket() {
		await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/me`).then((response) => {
			this.socket.emit(ClientEvents.connected, response.data);
		});
		this.socket.on(ServerEvents.gameReady, () => {
			this.notifications[ServerEvents.gameReady] = true;
		});
		this.socket.on(ServerEvents.disableNotifications, () => {
			Object.keys(this.notifications).forEach((key) => {
				this.setDisplayValue(key, false);
			});
		});
		this.socketReady = true;
	}

	getDisplayValue(notification: string): boolean {
		return this.notifications[notification as INotificationsKey];
	}

	setDisplayValue(notification: string, value: boolean): void {
		this.notifications[notification as INotificationsKey] = value;
	}

	getSocket(): Socket {
		return this.socket;
	}

	socketIsReady(): boolean {
		return this.socketReady;
	}
}

export default GlobalSocket;