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


// Outil de gestion des web socket events
@WebSocketGateway({ namespace: 'game' })
export class GameGateway 
	implements OnGatewayConnection, OnGatewayDisconnect {
	// On declare le serveur et les variables
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
			console.log("game disconnection: " + client.data.user.username);
			const room: Room = this.findRoom(client);
			if (room) {
				room.removeSocket(client);
				if (!room.checkSockets(client.data.user)) {
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
		const openRoom: Room = this.rooms.find((room) => {
			return (room.isOpen() && room.getParams().game == params.game);
		});
		if (openRoom) {
			openRoom.addUser(client.data.user);
			openRoom.addSocket(client);
			//notify waiting user that the game is ready
			this.userGateway.gameReady(openRoom);
			client.emit(serverEvents.waitingForOpponent);
		}
		else {
			const newRoom = this.createRoom(params, client);
			if (params.mode == "singlePlayer") {
				this.closeRoom(newRoom);
			}
			else {
				await this.userService.updateUserStatus(client.data.user, userStatus.waiting);
				client.emit(serverEvents.waiting);
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
		this.deleteRoom(this.findRoom(client));
		await this.userService.updateUserStatus(client.data.user, userStatus.undefined);
	}

	findRoom(client: Socket): Room {
		return this.rooms.find((room) => {
			return (room.getUsers().find((user) => {
				return (user.id == client.data.user.id);
			}));
		});
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

	closeRoom(room: Room) {
		console.log("closing room: " + room.getName());
		room.getUsers().forEach(async (user) => {
			await this.userService.updateUserStatus(user, userStatus.playing);
		});
		room.startGame();
		this.server.to(room.getName()).emit(serverEvents.started, room.getUsers(), room.getParams());
	}

	deleteRoom(room: Room) {
		console.log("deleting room: " + room.getName());
		room.getSockets().forEach(async (socket) => {
			socket.leave(room.getName());
			await this.userService.updateUserStatus(socket.data.user, userStatus.undefined);
		});
		this.rooms.splice(this.rooms.indexOf(room), 1);
	}
}
