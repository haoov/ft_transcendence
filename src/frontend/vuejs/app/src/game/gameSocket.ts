import { ClientEvents, ServerEvents, type User } from "@/utils";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import { ref, type Ref } from "vue";

class GameSocket {
	private readonly socket: Socket;
	private isReady: boolean;
	private readonly userStatus: Ref<string>;
	private moveEvents: boolean;
	private readonly user: Ref<User>;

	constructor() {
		this.socket = io(`http://${import.meta.env.VITE_HOSTNAME}:3000/game`);
		this.user = ref({} as User);
		this.isReady = false;
		this.userStatus = ref("");
		this.moveEvents = false;
	}

	async initSocket() {
		await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/me`).then((response) => {
			this.user.value = response.data;
			this.socket.emit(ClientEvents.connected, response.data);
		});
		this.socket.on(ServerEvents.updateStatus, (status: string) => {
			console.log("update status: " + status);
			if (this.userStatus.value != "finished")
				this.userStatus.value = status;
		})
		this.isReady = true;
	}

	play() {
		this.socket.emit(ClientEvents.gamePlay);
	}

	forfeit() {
		this.socket.emit(ClientEvents.gameForfeit);
	}

	setuserStatus(state: string): void {
		this.userStatus.value = state;
	}

	getSocket(): Socket {
		return this.socket;
	}

	socketIsReady(): boolean {
		return this.isReady;
	}

	getuserStatus(): string {
		return this.userStatus.value;
	}

	getUser(): User {
		return this.user.value;
	}
}

export default GameSocket;