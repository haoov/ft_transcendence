import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
//import { GameGatewayService } from './game.gateway.service';
import { clientEvents, serverEvents } from './enum';
import { User } from 'src/user/user.interface';
import { Room } from './classes/Room';
import { UserService } from 'src/user/user.service';
import { userStatus } from 'src/user/enum/userStatus.enum';
import { gameParams } from './interfaces/gameParams';
import { GameService } from './game.service';


// Outil de gestion des web socket events
@WebSocketGateway({ namespace: 'game', path: '/game' })
export class GameGateway 
	implements OnGatewayConnection, OnGatewayDisconnect {

	// On declare le serveur et les variables
	@WebSocketServer() server: Server;
	// classic_rooms: Room[]
	// classic_waiting: Socket[];
	// super_rooms: Room[]
	// super_waiting: Socket[];

	rooms: Room[];
	roomId: number;

	constructor(private readonly userService: UserService, private readonly gameService: GameService) {
		// this.classic_rooms = [];
		// this.classic_waiting = [];
		// this.super_rooms = [];
		// this.super_waiting = [];

		this.rooms = [];
		this.roomId = 0;
	}

	handleConnection(client: Socket) {
		//wait for connected event from client side
		client.on(clientEvents.connected, (data: User) => {
			//store user data in socket
			client.data.user = data;
			console.log("user connected: ", client.data.user);
			//if user is playing, add socket to room
			const room: Room = this.findRoom(client);
			if (room) {
				if (room.isFull()) {
					client.emit(serverEvents.started, room.getUsers(), room.getParams());
				}
				room.addSocket(client);
			}
		});
	}

	async handleDisconnect(client: Socket) {
		if (client.data.user) {
			console.log("disconnect user: ", client.data.user);
			const room: Room = this.findRoom(client);
			if (room) {
				room.removeSocket(client);
				if (!room.checkSockets(client.data.user)) {
					if (room.isFull()) {
						room.quitGame(client);
					}
					this.deleteRoom(room);
					await this.userService.updateUserStatus(client.data.user, userStatus.undefined);
				}
			}
		}

		// if (client.data.game === "classic")
		// 	this.gameGtwService.handleUserDisconnection(
		// 									client,
		// 									this.classic_rooms,
		// 									this.classic_waiting,
		// 									this.server);
		// else if (client.data.game === "super")
		// 	this.gameGtwService.handleUserDisconnection(
		// 									client,
		// 									this.super_rooms,
		// 									this.super_waiting,
		// 									this.server);
	}

	@SubscribeMessage('gameParams')
	async manageRooms(client: Socket, params: gameParams) {

		//check if there is a open room
		const openRoom: Room = this.rooms.find((room) => {
			return (room.isOpen() && room.getParams().game == params.game);
		});

		//if there is, add socket to room, and lock it
		if (openRoom) {
			openRoom.addSocket(client);
			this.closeRoom(openRoom);
		}

		//if there is not, create a new room and add socket to it
		else {
			const newRoom = this.createRoom(params, client.data.user);
			newRoom.addSocket(client);
			//if the game is on singlePlayer, update user status and start game
			if (params.mode == "singlePlayer") {
				this.closeRoom(newRoom);
			}
			else {
				await this.userService.updateUserStatus(client.data.user, userStatus.waiting);
				client.emit(serverEvents.waiting);

			}
		}
		// this.gameGtwService.assignMode(	client, this.classic_rooms, this.classic_waiting,
		// 																this.super_rooms, this.super_waiting, this.server,
		// 																params)
	}

	@SubscribeMessage(clientEvents.update)
	update(client: Socket) {
		const room: Room = this.findRoom(client);
		if (room) {
			const update = room.getGameUpdate();
			this.server.to(room.getName()).emit(serverEvents.updated, update);
			if (update.finished) {
				this.deleteRoom(room);
			}
		}

		// let room: Room;
		// if (client.data.game === "classic")
		// 	room = this.gameGtwService.findRoom(client, this.classic_rooms);
		// else
		// 	room = this.gameGtwService.findRoom(client, this.super_rooms);
		// if (room) {
		// 	let update = room.getGame().update();
		// 	this.server.to(room.getName()).emit("updated", update);
		// 	if (update.finished && client.data.game === "classic") {
		// 		this.gameGtwService.finishGame(room, this.classic_rooms, this.server);
		// 	}
		// 	else if (update.finished && client.data.game === "super")
		// 		this.gameGtwService.finishGame(room, this.super_rooms, this.server);
		// }
	}
	
	@SubscribeMessage('move')
	move(client: Socket, direction: string) {
		const room: Room = this.findRoom(client);
		if (room) {
			room.gameMove(client, direction);
		}

		// if (client.data.game === "classic")
		// 	this.gameGtwService.move(client, data, this.classic_rooms);
		// else if (client.data.game === "super")
		// 	this.gameGtwService.move(client, data, this.super_rooms);
	}

	@SubscribeMessage('stop_wait')
	async stopWaiting(client: Socket) {
		const room: Room = this.findRoom(client);
		room.getSockets().forEach((socket) => {socket.data.room = "";});
		await this.userService.updateUserStatus(client.data.user, userStatus.undefined);

		// if (client.data.game === "classic") {
		// 	this.classic_waiting.forEach((socket) => { this.gameGtwService.resetSocket(socket)});
		// 	this.classic_waiting.length = 0;
		// }
		// else if (client.data.game === "super") {
		// 	this.super_waiting.forEach((socket) => { this.gameGtwService.resetSocket(socket)});
		// 	this.super_waiting.length = 0;
		// }
		// await this.userService.updateUserStatus(client.data.user, UserStatus.undefined);
	}

	findRoom(client: Socket): Room {
		return this.rooms.find((room) => {
			return (room.getUsers().find((user) => {
				return (user.id == client.data.user.id);
			}));
		});
	}

	createRoom(params: gameParams, p1: User) {
		const newRoom = new Room(this.roomId.toString(), params, p1);
		++this.roomId;
		this.rooms.push(newRoom);
		console.log("new room");
		return newRoom;
	}

	closeRoom(room: Room) {
		console.log("closing room");
		room.getUsers().forEach(async (user) => {
			await this.userService.updateUserStatus(user, userStatus.playing);
		});
		room.startGame();
		this.server.to(room.getName()).emit(serverEvents.started, room.getUsers(), room.getParams());
	}

	deleteRoom(room: Room) {
		console.log("deleting room: " + room.getName());
		this.server.to(room.getName()).emit(serverEvents.finished, room.getWinner().username);
		this.gameService.createGame(room.getStats());
		room.getSockets().forEach(async (socket) => {
			await this.userService.updateUserStatus(socket.data.user, userStatus.undefined);
		});
		this.rooms.splice(this.rooms.indexOf(room), 1);
	}
}
