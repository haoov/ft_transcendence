import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { GameGatewayService } from './game.gateway.service';
import { clientEvents, serverEvents } from './enum';
import { User } from 'src/user/user.interface';
import { Room } from './classes/Room';
import { UserService } from 'src/user/user.service';
import { userStatus } from 'src/user/enum/userStatus.enum';
import { gameParams } from './interfaces/gameParams';


// Outil de gestion des web socket events
@WebSocketGateway({ namespace: 'game' })
export class GameGateway 
	implements OnGatewayConnection, OnGatewayDisconnect {

	// On declare le serveur et les variables
	@WebSocketServer() server: Server;
	// classic_rooms: Room[]
	// classic_waiting: Socket[];
	// super_rooms: Room[]
	// super_waiting: Socket[];

	rooms: Room[];

	constructor(private readonly userService: UserService) {
		// this.classic_rooms = [];
		// this.classic_waiting = [];
		// this.super_rooms = [];
		// this.super_waiting = [];

		this.rooms = [];
	}

	handleConnection(client: Socket) {
		//wait for connected event from client side
		client.on(clientEvents.connected, (data: User) => {
			//store user data in socket
			client.data.user = data;
			//if user is playing, add socket to room
			if (client.data.user.status == userStatus.playing) {
				this.rooms.find((room) => {
					return (room.getUsers().find((user) => {
						return (user.id == client.data.user.id);
					}));
				}).addSocket(client);
			}
		});
	}

	handleDisconnect(client: Socket) {
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

		//check if there is a room available
		const availableRoom: Room = this.rooms.find((room) => {
			return (room.isPublic() && !room.isFull() && room.getType() == params.game);
		});

		//if there is, add socket to room, update users status and start game
		if (availableRoom) {
			availableRoom.addSocket(client);
			availableRoom.getUsers().forEach(async (user) => {
				await this.userService.updateUserStatus(user, userStatus.playing);
			});
			//?add more players ?
			availableRoom.startGame();
			this.server.to(availableRoom.getName()).emit(serverEvents.started);
		}

		//if there is not, create a new room
		else {
			const newRoom = new Room(this.rooms.length.toString(), params, client.data.user);
			newRoom.addSocket(client);
			this.rooms.push(newRoom);
			//if the game is on singlePlayer, update user status and start game
			if (params.mode == "siglePlayer") {
				await this.userService.updateUserStatus(client.data.user, userStatus.playing);
				newRoom.startGame();
				this.server.to(newRoom.getName()).emit(serverEvents.started);
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
		const room: Room = this.rooms.find((room) => {
			return (room.getSockets().find((socket) => {
				return (socket.data.user.id == client.id);
			}));
		});
		if (room) {
			const update = room.game.update();
			this.server.to(room.getName()).emit(clientEvents.update, update);
			if (update.finished) {
				this.server.to(room.getName()).emit(serverEvents.finished, room.getWinner().username);
				room.getSockets().forEach(async (socket) => {
					await this.userService.updateUserStatus(socket.data.user, userStatus.undefined);
					socket.data.game = "";
					socket.data.room = "";
					socket.data.side = "";
				});
				this.rooms.splice(this.rooms.indexOf(room), 1);
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
	move(client: Socket, data: string) {
		const room: Room = this.rooms.find((room) => {
			return (room.getUsers().find((user) => {
				return (user.id == client.data.user.id);
			}));
		});
		room.game.movePaddle(client.data.side, data);

		// if (client.data.game === "classic")
		// 	this.gameGtwService.move(client, data, this.classic_rooms);
		// else if (client.data.game === "super")
		// 	this.gameGtwService.move(client, data, this.super_rooms);
	}

	@SubscribeMessage('stop_wait')
	async stopWaiting(client: Socket) {
		const room: Room = this.rooms.find((room) => {
			return (room.getUsers().find((user) => {
				return (user.id == client.data.user.id);
			}));
		});
		room.getSockets().forEach(async (socket) => {
			socket.data.game = "";
			socket.data.room = "";
			socket.data.side = "";
		});
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
}
