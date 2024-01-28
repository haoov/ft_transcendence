import { ClientEvents, ServerEvents, type User } from "@/utils";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import notify from "./notify/notify";
import router from "./router";
import { reactive } from "vue";
import type { GameParams } from "./game/interfaces";
import gameData from "./game/gameData";
import { chat, Channel, type ChannelParams, type MessageData, type ChannelData } from "@/chat";

class SocketManager {
	private readonly userSocket: Socket;
	private readonly gameSocket: Socket;
	private readonly chatSocket: Socket;
	private user: User;

	constructor() {
		this.userSocket = io(`http://${import.meta.env.VITE_HOSTNAME}:3000/users`, {autoConnect: false});
		this.gameSocket = io(`http://${import.meta.env.VITE_HOSTNAME}:3000/game`, {autoConnect: false});
		this.chatSocket = io(`http://${import.meta.env.VITE_HOSTNAME}:3000/chat`, {autoConnect: false});
		this.user = {} as User;
	}

	async initSocket() {
		this.chatSocket.connect();
		await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/me`).then((response) => {
			this.user = response.data;
			this.chatSocket.emit("userConnected", this.user);
			chat.loadChannels(this.user.id);
		});

		this.userSocket.on(ServerEvents.dataChanged, (data: User) => {
			if (data.id == this.user.id) {
				this.user = data;
				if (data.status == "waiting")
				gameData.setGameState("waiting");
			}
		});

		this.userSocket.on(ServerEvents.gameReady, (data: User) => {
			if (router.currentRoute.value.path != "/game") {
				const play = () => {
					this.checkGame();
					router.push("/game");
				};
				if (data.id != this.user.id) {
					notify.newNotification("gameReady", {
						by: data.username,
						buttons: [
							{action: play}
						]
					});
				}
			}
			else {
				gameData.setGameState("play")
			}
		});

		this.userSocket.on(ServerEvents.gameInvite, (data: User) => {
			const accept = () => {
				this.gameSocket.emit(ClientEvents.gameResponse, {accepted: true, opponent: data});
				gameData.setGameState("ready");
				gameData.setOpponent(data.username);
				this.checkGame();
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

		this.userSocket.on(ServerEvents.gameResponse, (response: {accepted: boolean, opponent: User}) => {
			if (!response.accepted) {
				notify.newNotification("error", {
					message: 'Invitation declined',
					by: response.opponent.username,
				});
			}
		});

		this.chatSocket.on("newMessage", (message: MessageData) => {
			chat.newMessage(message);
		});

		this.chatSocket.on("newChannelCreated", (data: ChannelData) => {
			const newChannel = new Channel(data);
			chat.addChannel(newChannel);
		});

		this.chatSocket.on("channelUpdated", (data: ChannelData) => {
			chat.channelUpdate(data);
		});
	}

	checkGame() {
		this.gameSocket.emit(ClientEvents.checkGame);
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
}

const socketManager = new SocketManager();

export { socketManager, SocketManager };