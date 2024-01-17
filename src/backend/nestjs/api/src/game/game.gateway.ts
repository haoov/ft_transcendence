import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { clientEvents, serverEvents } from './enum';
import { User } from 'src/user/user.interface';
import { Room } from './classes/Room';
import { UserService } from 'src/user/user.service';
import { userStatus } from 'src/user/enum/userStatus.enum';
import { gameParams } from './interfaces/gameParams';
import { GameService } from './game.service';
import { UserGateway } from 'src/user/user.gateway';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway({ namespace: 'game' })
export class GameGateway 
	implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	rooms: Room[];
	roomId: number;

	constructor(	private readonly userService: UserService,
								@Inject(forwardRef(() => UserGateway)) private readonly userGateway: UserGateway,
								private readonly gameService: GameService) {
		this.rooms = [];
		this.roomId = 0;
	}

	handleConnection(client: Socket) {
		//wait for connected event from client side
		client.on(clientEvents.connected, (data: User) => {
			console.log("game connection: " + data.username);
			//store user data in socket
			client.data.user = data;
			//if user is already in a room
			const room: Room = this.findRoom(client);
			if (room)
				this.manageSocket(client, room);
		});
	}

	async handleDisconnect(client: Socket) {
		if (client.data.user) {
			console.log("game disconnection: " + client.data.user.username);
			const room: Room = this.findRoom(client);
			if (room) {
				room.removeSocket(client);
				if (!room.checkSockets(client.data.user) && room.getParams().mode == "multiPlayer") {
					if (room.isFull()) {
						room.quitGame(client);
						this.endGame(room);
					}
					this.deleteRoom(room);
					await this.userService.updateUserStatus(client.data.user, userStatus.undefined);
				}
			}
		}
	}

	@SubscribeMessage(clientEvents.gameParams)
	async manageRooms(client: Socket, params: gameParams) {
		const openRoom: Room = this.checkOpenRoom(client.data.user, params);
		if (openRoom) {
			if (openRoom.hasUser(client.data.user))
				this.manageSocket(client, openRoom);
			else {
				openRoom.addUser(client.data.user);
				openRoom.addSocket(client);
				this.userGateway.gameReady(openRoom);
				client.emit(serverEvents.updateStatus, "waiting for opponent");
			}
		}
		else {
			const newRoom = this.createRoom(params, client);
			if (params.mode == "singlePlayer") {
				this.closeRoom(newRoom);
			}
			else {
				await this.userService.updateUserStatus(client.data.user, userStatus.waiting);
				client.emit(serverEvents.updateStatus, "waiting");
			}
		}
	}

	@SubscribeMessage(clientEvents.update)
	update(client: Socket) {
		const room: Room = this.findRoom(client);
		if (room) {
			const data = room.getGameData();
			client.emit(serverEvents.updated, data);
			if (data.finished) {
				this.endGame(room);
				this.deleteRoom(room);
			}
		}
	}
	
	@SubscribeMessage(clientEvents.move)
	move(client: Socket, direction: string) {
		const room: Room = this.findRoom(client);
		if (room)
			room.gameMove(client, direction);
	}

	@SubscribeMessage(clientEvents.useSpell)
	useSpell(client: Socket, type: string) {
		const room: Room = this.findRoom(client);
		if (room) {
			room.gameUseSpell(client, type);
		}
	}

	@SubscribeMessage(clientEvents.leave)
	leave(client: Socket) {
		const room: Room = this.findRoom(client);
		if (room)
			room.removeSocket(client);
	}

	@SubscribeMessage(clientEvents.stopWaiting)
	async stopWaiting(client: Socket) {
		const room = this.findRoom(client);
		if (room) {
			if (room.isFull()) {
				room.quitGame(client);
				this.endGame(room);
			}
			this.deleteRoom(room);
		}
	}

	@SubscribeMessage(clientEvents.gamePlay)
	gamePlay(client: Socket) {
		const room: Room = this.findRoom(client);
		if (room)
			this.closeRoom(room);
	}

	@SubscribeMessage(clientEvents.gameForfeit)
	gameForfeit(client: Socket) {
		const room: Room = this.findRoom(client);
		if (room) {
			room.quitGame(client);
			this.endGame(room);
			this.deleteRoom(room);
		}
	}

	findRoom(client: Socket): Room {
		return this.rooms.find((room) => {
			return (room.getUsers().find((user) => {
				return (user.id == client.data.user.id);
			}));
		});
	}

	checkOpenRoom(user: User, params: gameParams): Room {
		const availableRoom: Room = this.rooms.find((room) => {
			return (room.isOpen() && room.getParams().game == params.game);
		});
		return availableRoom;
	}

	endGame(room: Room) {
		room.stopGame();
		this.server.to(room.getName()).emit(serverEvents.finished, room.getWinner().username);
		if (room.getParams().mode == "multiPlayer") {
			this.gameService.createGame(room.getStats());
		}
	}

	createRoom(params: gameParams, client: Socket) {
		console.log("creating room: " + this.roomId);
		const newRoom = new Room(this.roomId.toString(), params);
		++this.roomId;
		newRoom.addUser(client.data.user);
		newRoom.addSocket(client);
		this.rooms.push(newRoom);
		return newRoom;
	}

	manageSocket(client: Socket, room: Room) {
		room.addSocket(client);
		if (room.isClosed())
			client.emit(serverEvents.started, room.getUsers(), room.getParams());
		else
			client.emit(serverEvents.updateStatus, "waiting");
	}

	closeRoom(room: Room) {
		console.log("closing room: " + room.getName());
		room.getUsers().forEach(async (user) => {
			await this.userService.updateUserStatus(user, userStatus.playing);
		});
		this.userGateway.disableNotifications(room.getUsers());
		this.server.to(room.getName()).emit(serverEvents.started, room.getUsers(), room.getParams());
		room.startGame();
	}

	deleteRoom(room: Room) {
		console.log("deleting room: " + room.getName());
		this.server.to(room.getName()).emit(serverEvents.updateStatus, "");
		room.getSockets().forEach(async (socket) => {
			room.removeSocket(socket);
			await this.userService.updateUserStatus(socket.data.user, userStatus.undefined);
		});
		this.rooms.splice(this.rooms.indexOf(room), 1);
		this.userGateway.disableNotifications(room.getUsers());
	}
}
