import { ChatEvents, ClientEvents, ServerEvents, type User } from "@/utils";
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
		this.userSocket.connect();
		this.chatSocket.connect();
		this.gameSocket.connect();
		await axios.get(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/me`).then((response) => {
			this.user = response.data;
			this.userSocket.emit("userConnected", this.user);
			this.chatSocket.emit("userConnected", this.user);
			this.gameSocket.emit("userConnected", this.user);
			chat.loadChannels(this.user.id);
		});

		this.userSocket.on(ServerEvents.ping, () => {
			console.log("PONG");
			this.userSocket.emit(ClientEvents.pong, {});
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
			notify.newNotification("invite", {
				message: 'Game invite',
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

		this.userSocket.on(ServerEvents.addFriend, (from: User) => {
			const accept = async () => {
				await axios.put(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/friend/add?id=${from.id}`);
				this.userSocket.emit(ClientEvents.friendResponse, {accepted: true, opponent: from});
			};
			const decline = async () => {
				await axios.put(`http://${import.meta.env.VITE_HOSTNAME}:3000/api/user/friend/delete?id=${from.id}`);
			};
			notify.newNotification("invite", {
				message: 'Friend request',
				by: from.username,
				autoClose: true,
				timeout: 4000,
				timeOutBar: true,
				buttons: [
					{action: accept},
					{action: decline}
				]
			});
		});

		this.userSocket.on(ServerEvents.friendResponse, (response: {accepted: boolean, opponent: User}) => {
			if (response.accepted) {
				notify.newNotification("infos", {
					message: 'Friend request accepted',
					by: response.opponent.username,
				});
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

	addFriend(friendId: number, id: number) {
		this.userSocket.emit(ClientEvents.addFriend, friendId);
	}

	useSpell(spell: string) {
		this.gameSocket.emit(ClientEvents.useSpell, spell);
	}

	move(direction: string) {
		this.gameSocket.emit(ClientEvents.move, direction);
	}

	emit(socket: string, event: string, ...args: any[]) {
		if (socket == "user")
			this.userSocket.emit(event, ...args);
		else if (socket == "game")
			this.gameSocket.emit(event, ...args);
		else if (socket == "chat")
			this.chatSocket.emit(event, ...args);
	}

	sendMessage(message: any) {
		// console.log(message);
		this.chatSocket.emit("newMessageSend", message);
	}

	createChannel(channel: any) {
		this.chatSocket.emit(ChatEvents.createNewChannel, channel);
	}

	deleteChannel(id : number) {
		this.chatSocket.emit(ChatEvents.deleteChannel, id);
	}

	joinChannel(id: number, pw: string)
	{
		const userID = this.user.id;
		this.chatSocket.emit(ChatEvents.joinChannel,{
			channelId: id,
			password: pw,
			userId: userID,
		})
	}

	leaveChannel(id: number) {
		const userID = this.user.id;
		this.chatSocket.emit(ChatEvents.leaveChannel, {id, userID})
	}

	updateChannel(id: number, name: string, mode: string, pw: string, userIds: number []) {
		const editedChannel = {
			channelId: id,
			name: name, 
			mode: mode,
			password: pw,
			userIds: userIds,
		};
	}

	addUserToChannel(channelId: number, users: User []) {
		for (const user of users) {
			const id = user.id;
			this.chatSocket.emit(ChatEvents.addUserToChannel, {channelId, id});
		}
	}

	setActiveChannel(channelId: number) {
		this.chatSocket.emit(ChatEvents.setActiveChannel,{
			'channelId':channelId,
			'currentUserId': this.user.id
		} );
	}

	emitAction(action: string, userID : number, channelID: number)
	{
		if (action === 'admin') {
			this.chatSocket.emit(ChatEvents.setAdmin ,{userId: userID, channelId: channelID});
		} else if (action === 'kick') {
			this.chatSocket.emit(ChatEvents.kickUser ,{userId: userID, channelId: channelID});
		} else if (action === 'ban') {
			this.chatSocket.emit(ChatEvents.banUser ,{userId: userID, channelId: channelID});
		}
	}
}

const socketManager = new SocketManager();

export { socketManager, SocketManager };