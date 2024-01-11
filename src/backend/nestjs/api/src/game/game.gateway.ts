import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { clientEvents, serverEvents } from './enum';
import { User } from 'src/user/user.interface';
import { Room } from './classes/Room';
import { UserService } from 'src/user/user.service';
import { userStatus } from 'src/user/enum/userStatus.enum';
import { gameParams } from './interfaces/gameParams';
import { GameService } from './game.service';
import { rules } from './data/opts';


// Outil de gestion des web socket events
@WebSocketGateway({ namespace: 'game' })
export class GameGateway 
	implements OnGatewayConnection, OnGatewayDisconnect {
	// On declare le serveur et les variables
	@WebSocketServer() server: Server;
	rooms: Room[];
	roomId: number;

	constructor(	private readonly userService: UserService,
								private readonly gameService: GameService) {
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
			openRoom.addSocket(client);
			this.closeRoom(openRoom);
		}
		else {
			const newRoom = this.createRoom(params, client.data.user);
			newRoom.addSocket(client);
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
			const update = room.getGameUpdate();
			this.server.to(room.getName()).emit(serverEvents.updated, update);
			if (update.finished) {
				this.endGame(room);
				this.deleteRoom(room);
			}
		}
	}
	
	@SubscribeMessage(clientEvents.move)
	move(client: Socket, direction: string) {
		const room: Room = this.findRoom(client);
		if (room) {
			room.gameMove(client, direction);
		}
	}

	@SubscribeMessage(clientEvents.useSpell)
	useSpell(client: Socket, type: string) {
		const room: Room = this.findRoom(client);
		if (room) {
			room.gameUseSpell(client, type);
		}
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
		this.server.to(room.getName()).emit(serverEvents.finished, room.getWinner().username);
		if (room.getParams().mode == "multiPlayer") {
			this.gameService.createGame(room.getStats());
		}
	}

	createRoom(params: gameParams, p1: User) {
		console.log("creating room" + this.roomId.toString());
		const newRoom = new Room(this.roomId.toString(), params, p1);
		++this.roomId;
		this.rooms.push(newRoom);
		return newRoom;
	}

	closeRoom(room: Room) {
		console.log("closing room" + room.getName());
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
