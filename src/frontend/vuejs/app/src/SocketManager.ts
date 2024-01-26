import { ChatEvents, ClientEvents, ServerEvents, type User } from "@/utils";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import notify from "./notify/notify";
import router from "./router";
import { reactive } from "vue";
import type { GameParams } from "./game/interfaces";
import gameData from "./game/gameData";
// import chat from "./minichat/chat";
import chat from "@/components/chat/classes/chat";
import { Channel } from "@/components/chat/classes/channel"
import { Message } from "@/components/chat/classes/message"

class SocketManager {
	private readonly userSocket: Socket;
	private readonly gameSocket: Socket;
	private readonly chatSocket: Socket;
	private user: User;

	constructor() {
		this.userSocket = io(`http://${import.meta.env.VITE_HOSTNAME}:3000/users`);
		this.gameSocket = io(`http://${import.meta.env.VITE_HOSTNAME}:3000/game`);
		this.chatSocket = io(`http://${import.meta.env.VITE_HOSTNAME}:3000/chat`);
		this.user = {} as User;
	}

	async initSocket() {
		await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/me`).then((response) => {
			this.user = reactive(response.data);
			this.userSocket.emit(ClientEvents.connected, response.data);
			this.gameSocket.emit(ClientEvents.connected, response.data);
			this.chatSocket.emit(ClientEvents.connected, response.data);
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

		this.chatSocket.on(ChatEvents.receivedMessage, (data: any) => {
			const channel = chat.getChannelById(data.message.channelId);
			if (channel) {
				const newMessage = new Message(	data.id, data.sender, data.message.text, data.message.time);
				channel.addMessage(newMessage);
			}
		});
	}

	checkGame() {
		this.gameSocket.emit(ClientEvents.checkGame);
	}

	addEventListener(socket: "user" | "game" | "chat", event: string, callback: (...args: any[]) => void) {
		if (socket == "user")
			this.userSocket.on(event, callback);
		else if (socket == "game")
			this.gameSocket.on(event, callback);
		else if (socket == "chat")
			this.chatSocket.on(event, callback);
	}

	removeEventListener(socket: "user" | "game" | "chat", event: string, callback: (...args: any[]) => void) {
		if (socket == "user")
			this.userSocket.off(event, callback);
		else if (socket == "game")
		this.gameSocket.off(event, callback);
		else if (socket == "chat")
			this.chatSocket.off(event, callback);
	}

	hasEventListener(socket: "user" | "game" | "chat", event: string): boolean {
		if (socket == "user")
			return this.userSocket.hasListeners(event);
		else if (socket == "game")
			return this.gameSocket.hasListeners(event);
		else if (socket == "chat")
			return this.chatSocket.hasListeners(event);
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

	/*CHAT*/
	sendMessage(message: any) {
		console.log('[SocketMangager.sendMessage]: ', message);
		this.chatSocket.emit(ChatEvents.sendMessage, message);
	}

	addUserToChannel(channelId : number, users : User []) {
		this.chatSocket.emit(ChatEvents.addUserToChannel, {channelId, users} );
	}

	setActiveChannel(channel : Channel) {
		this.chatSocket.emit(ChatEvents.setActiveChannel, {
			"channelId": channel.getId(), 
			"currentUserId": this.user.id,
		});
	}

	resetActiveChannel() {
		this.chatSocket.emit(ChatEvents.resetActiveChannel, this.user.id);
	}

	createChannel(channel: Object) {
			this.chatSocket.emit(ChatEvents.createChannel, channel);
	}
	
	deleteChannel(id :number) {
		this.chatSocket.emit(ChatEvents.deleteChannel, id);
	}

	leaveChannel(id : number) {
		this.chatSocket.emit(ChatEvents.leaveChannel, {
			id,
			userId: this.user.id,
		});
	}

	updateChannel(channel: Channel) {
		this.chatSocket.emit(ChatEvents.updateChannel, channel);
	}

	joinChannel(id: number, password: string) {
		this.chatSocket.emit(ChatEvents.joinChannel, {
			channelId: id,
			password: password,
			userId: this.user.id,
		});
	}

	actionsHandler(action: string, targetId: number, channelId: number) {
		if (action == "setAdmin") {
			this.chatSocket.emit(ChatEvents.setAdmin, {userId: targetId, channelId: channelId});
		} else if (action == "kickUser") {
			this.chatSocket.emit(ChatEvents.kickUser, {userId: targetId, channelId: channelId});
		} else if (action == "banUser") {
			this.chatSocket.emit(ChatEvents.banUser, {userId: targetId, channelId: channelId});
		}
	}
}

const socketManager = new SocketManager();

export { socketManager, SocketManager };