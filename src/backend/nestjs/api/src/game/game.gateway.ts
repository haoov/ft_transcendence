import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { clientEvents, serverEvents } from './enum/events.enum';
import { User } from 'src/user/user.interface';
import { Room } from './classes/Room';
import { UserService } from 'src/user/user.service';
import { userStatus } from 'src/user/enum/userStatus.enum';
import { GameParams } from './interfaces/gameParams';
import { GameService } from './game.service';
import { UserGateway } from 'src/user/user.gateway';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway({ namespace: 'game' })
export class GameGateway 
	implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	rooms: Room[];
	roomId: number;

	constructor(private readonly userService: UserService,
								@Inject(forwardRef(() => UserGateway)) private readonly userGateway: UserGateway,
								private readonly gameService: GameService) {
		this.rooms = [];
		this.roomId = 0;
	}

/*----------------------------------------------------------------------------*/
/*                                EVENTS HANDLING                             */
/*----------------------------------------------------------------------------*/

	/**
	 * Handle connection of a user
	 * @param client socket of the user
	 */
	handleConnection(client: Socket) {
		//wait for connected event from client side
		client.on(clientEvents.connected, (data: User) => {
			console.log("game connection: " + data.username);
			//store user data in socket
			client.data.user = data;
			//check if user is already in a room
			const room: Room = this.findRoom(client);
			if (room) {
				//if user is already in a room manage socket
				this.manageSocket(client, room);
			}
		});
	}

	/**
	 * Handle disconnection of a user
	 * @param client socket of the user
	 */
	async handleDisconnect(client: Socket) {
		if (client.data.user) {
			console.log("game disconnection: " + client.data.user.username);
			const room: Room = this.findRoom(client);
			if (room) {
				if (room.isFull()) {
					room.removeSocket(client);
					if (!room.checkSockets(client.data.user) && room.getParams().type == "multiplayer") {
						room.quitGame(client);
						this.endGame(room);
						this.deleteRoom(room);
					}
				}
				else {
					room.removeSocket(client);
				}
			}
		}
	}

	@SubscribeMessage(clientEvents.checkGame)
	checkGame(client: Socket) {
		console.log("checking game: " + client.data.user.username);
		//check if user is already in a room
		const room: Room = this.findRoom(client);
		if (room) {
			//if user is already in a room manage socket
			this.manageSocket(client, room);
		}
	}

	/**
	 * Room management when user has selected game parameters
	 * @param client socket of the user
	 * @param params selected game parameters
	 */
	@SubscribeMessage(clientEvents.gameParams)
	async manageRooms(client: Socket, params: GameParams): Promise<void> {
		//check if there is an open room with the same game
		const openRoom: Room = this.checkOpenRoom(client.data.user, params);
		if (openRoom) {
			//if there is an open room
			if (openRoom.hasUser(client.data.user)) {
				//if user is already in the room manage socket
				this.manageSocket(client, openRoom);
			}
			else {
				//else add user to the room and send notification to opponent
				openRoom.addSocket(client);
				openRoom.addUser(client.data.user);
				this.userGateway.gameReady(openRoom, client.data.user);
				client.emit(serverEvents.gameReady);
				//wait for opponent to be ready
				setTimeout(() => {
					if (openRoom.isOpen()) {
						openRoom.quitGame(openRoom.getSockets()[0]);
						this.endGame(openRoom);
						this.deleteRoom(openRoom);
					}
				}, 10000);
			}
		}
		else {
			//else create a new room
			const newRoom = this.createRoom(params, client);
			if (params.type == "singleplayer") {
				//if single player start game
				this.closeRoom(newRoom);
			}
			else {
				//else wait for opponent
				client.data.user = await this.userService.updateUserStatus(client.data.user, userStatus.waiting);
				this.userGateway.dataChanged(client.data.user);
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
				//test
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

	@SubscribeMessage(clientEvents.stopWaiting)
	async stopWaiting(client: Socket) {
		const room = this.findRoom(client);
		if (room) {
			if (room.isClosed()) {
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

	@SubscribeMessage(clientEvents.gameResponse)
	gameResponse(client: Socket, response: {accepted: boolean, opponent: User}) {
		if (response.accepted) {
			const room: Room = this.createPrivateRoom(client.data.user, response.opponent);
			this.userGateway.gameReady(room, client.data.user);
		}
	}

/*----------------------------------------------------------------------------*/
/*                                UTILS METHODS                               */
/*----------------------------------------------------------------------------*/

	/**
	 * Find the room where the socket's user is
	 * @param client socket of the user
	 * @returns the room where the user is
	 */
	findRoom(client: Socket): Room | undefined {
		return this.rooms.find((room) => {
			return (room.getUsers().find((user) => {
				return (user.id == client.data.user.id);
			}));
		});
	}

	/**
	 * Check if there is an open room with the same game
	 * @param user
	 * @param params game parameters
	 * @returns 
	 */
	checkOpenRoom(user: User, params: GameParams): Room {
		const availableRoom: Room = this.rooms.find((room) => {
			return (room.isAvailable() && room.getParams().mode == params.mode);
		});
		return availableRoom;
	}

	/**
	 * End game and send winner to clients
	 * @param room 
	 */
	endGame(room: Room) {
		room.stopGame();
		this.server.to(room.getName()).emit(serverEvents.finished, room.getWinner().username);
		if (room.getParams().type == "multiplayer") {
			//if multiplayer update users stats
			this.gameService.createGame(room.getStats());
		}
	}

	/**
	 * Create a new room and add the socket's user to it
	 * @param params game parameters
	 * @param client socket of the user
	 * @returns the new room
	 */
	createRoom(params: GameParams, client: Socket) {
		console.log("creating room: " + this.roomId);
		const newRoom = new Room(this.roomId.toString(), {gameParams: params});
		++this.roomId;
		newRoom.addUser(client.data.user);
		newRoom.addSocket(client);
		this.rooms.push(newRoom);
		return newRoom;
	}

	createPrivateRoom(user: User, opponent: User) {
		console.log("creating private room: " + this.roomId);
		const params: GameParams = {
			mode: "super",
			type: "multiplayer",
			map: "random",
		};
		const newRoom = new Room(this.roomId.toString(), {
			gameParams: params,
			setPrivate: true
		});
		++this.roomId;
		newRoom.addUser(opponent);
		newRoom.addUser(user);
		this.rooms.push(newRoom);
		return newRoom;
	}

	/**
	 * Manage socket when user is already in a room
	 * @param client socket of the user
	 * @param room room where the socket's user is
	 */
	async manageSocket(client: Socket, room: Room) {
		room.addSocket(client);
		if (room.isClosed()) {
			//if room is closed notify that game has started
			client.emit(serverEvents.started, room.getUsers(), room.getParams());
			client.data.user = await this.userService.updateUserStatus(client.data.user, userStatus.playing);
			this.userGateway.dataChanged(client.data.user);
		}
		else {
			if (room.isFull()) {
				console.log("room is full: " + room.getName());
				//if room is full start game
				this.closeRoom(room);
			}
			else if (room.isPublic()){
				//else wait for opponent
				client.data.user = await this.userService.updateUserStatus(client.data.user, userStatus.waiting);
				this.userGateway.dataChanged(client.data.user);
			}
		}
	}

	/**
	 * Close a room and start game
	 * @param room 
	 */
	closeRoom(room: Room) {
		console.log("closing room: " + room.getName());
		room.getUsers().forEach(async (user) => {
			user = await this.userService.updateUserStatus(user, userStatus.playing);
			this.userGateway.dataChanged(user);
		});
		this.server.to(room.getName()).emit(serverEvents.started, room.getUsers(), room.getParams());
		room.startGame();
	}

	/**
	 * Delete a room
	 * @param room 
	 */
	deleteRoom(room: Room) {
		console.log("deleting room: " + room.getName());
		room.getSockets().forEach(async (socket) => {
			socket.data.user = await this.userService.updateUserStatus(socket.data.user, userStatus.online);
			this.userGateway.dataChanged(socket.data.user);
			room.removeSocket(socket);
		});
		this.rooms.splice(this.rooms.indexOf(room), 1);
		room.close();
	}
}
