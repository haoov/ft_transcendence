import { ClientEvents, ServerEvents, type User } from "@/utils";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import { ref, type Ref } from "vue";

class GameSocket {
	private readonly socket: Socket;
	private isReady: boolean;
	private readonly userState: Ref<string>;
	private moveEvents: boolean;
	private readonly user: Ref<User>;

	constructor() {
		this.socket = io(`http://${import.meta.env.VITE_HOSTNAME}:3000/game`);
		this.user = ref({} as User);
		this.isReady = false;
		this.userState = ref("");
		this.moveEvents = false;
	}

	async initSocket() {
		await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/me`).then((response) => {
			this.user.value = response.data;
			this.socket.emit(ClientEvents.connected, response.data);
		});
		this.socket.on(ServerEvents.waiting, () => {
			this.userState.value = "waiting";
		});
		this.socket.on(ServerEvents.waitingForOpponent, () => {
			this.userState.value = "waitingForOpponent";
		});
		this.isReady = true;
	}

	setMoveEvents(value: boolean): void {
		this.moveEvents = value;
	}

	moveEventsSet(): boolean {
		return this.moveEvents;
	}

	stopWaiting(): void {
		this.socket.emit(ClientEvents.stopWaiting);
		this.userState.value = "";
	}

	setUserState(state: string): void {
		this.userState.value = state;
	}

	getSocket(): Socket {
		return this.socket;
	}

	socketIsReady(): boolean {
		return this.isReady;
	}

	getUserState(): string {
		return this.userState.value;
	}

	getUser(): User {
		return this.user.value;
	}
}

export default GameSocket;