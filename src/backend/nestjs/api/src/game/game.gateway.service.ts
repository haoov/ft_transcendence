import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { ServerEvents } from "./enum";
import { UserStatus } from "src/user/enum/userStatus.enum";
import { Room } from "./classes";
import { UserService } from "src/user/user.service";
import { Pong } from "./data/Pong";
import { RouterModule } from "@nestjs/core";

@Injectable()
export class GameGatewayService {

	constructor(private readonly userService: UserService) {}

	assignMode(client: Socket, data:string, classic_r: Room[], classic_w: Socket[], super_r: Room[], super_w: Socket[], server:Server) {
		client.data.mode = data;
		if (data === "classic")
			this.manageUserGame(client, classic_r, classic_w, server);
		else if (data === "super")
			this.manageUserGame(client, super_r, super_w, server);

	}

	async manageUserGame(client: Socket, rooms: Room[], waiting: Socket[], server: Server) {
		// if (client.data.user.status === UserStatus.playing) {
		// 	const room: Room = this.findRoom(client, rooms);
		// 	room.addSocket(client);
		// 	this.emitPositon(room, server);
		// } 
		// else if (client.data.user.status === UserStatus.waiting || waiting.length < 1) {
		// 	if (client.data.user.status !== UserStatus.waiting)
		// 		await this.userService.updateUserStatus(client.data.user, UserStatus.waiting);
		// 	waiting.push(client);
		// 	client.emit(ServerEvents.waiting);
		// }
		// A COMMENTER
		if (waiting.length < 1) {
			await this.userService.updateUserStatus(client.data.user, UserStatus.waiting);
			waiting.push(client);
			client.emit(ServerEvents.waiting);
		}
		else {
			// Empty the 'waiting' tab
			const opponent: Socket[] = [...waiting];
			waiting.length = 0;

			// Define the status for the 2 players
			await this.userService.updateUserStatus(client.data.user, UserStatus.playing);
			opponent.forEach(async (socket) => {
				await this.userService.updateUserStatus(socket.data.user, UserStatus.playing);})

			
			// Start game
			const name: string = rooms.length.toString() + client.data.mode;
			const room: Room = new Room(name, opponent, client)
			rooms.push(room);
			room.getGame().start();
			server.to(name).emit("started");
		}
	}

	findRoom(client: Socket, rooms: Room[]) : Room {
		return rooms.find((currentRoom) => {return (currentRoom.getName() == client.data.room);});
	}

	// getRoomSocketCount(client: Socket, rooms: Room[]) : number {
	// 	const room: Room = this.findRoom(client, rooms);
	// 	if (!room)
	// 		return 0;
	// 	const sockets = room.getSockets();
	// 	var count: number = 0;
	// 	for (var i = 0; i < sockets.length; i++) {
	// 		if (sockets[i].data.user.id === client.data.user.id)
	// 			count++;
	// 	}
	// 	return count;
	// }


	move(client: Socket, direction: string, rooms: Room[]) {
		const room: Room = this.findRoom(client, rooms);
		room.getGame().movePaddle(client.data.side, direction);
	}


	// finishGame(room: Room, rooms: Room[], server: Server) {
	// 	server.to(room.getName()).emit(ServerEvents.finished,
	// 									room.getWinner(),
	// 									room.getP1score(),
	// 									room.getP2score());
	// 	room.getSockets().forEach(async (socket) => {
	// 		await this.userService.updateUserStatus(socket.data.user, UserStatus.undefined);
	// 		socket.data.side = "";
	// 	});
	// 	rooms.splice(rooms.indexOf(room), 1);
	// 	// Database management
	// }

	socketCount(client: Socket, room: Room) {
		let count: number = 0;
		const sockets: Socket[] = room.getSockets();
		for(let i = 0; i < sockets.length; i++) {
			if (sockets[i].data.user.id === client.data.user.id)
				count++;
		}
		return count;
	}

	async handleUserDisconnection(client: Socket, rooms: Room[], waiting: Socket[], server: Server) {
		if (client.data.user && client.data.user.status === UserStatus.playing) {
			const room: Room = this.findRoom(client, rooms);
			// A REMETTRE APRES POUR FINISH GAME
			// if (room && this.socketCount(client, room) === 1) {
			// 	this.finishGame(room, rooms, server);
			// }
			// else if (room) {
			// 	room.removeSocket(client);
			// }
			if (room) {
				room.getSockets().forEach(async (socket) => {
					await this.userService.updateUserStatus(socket.data.user, UserStatus.undefined);
					room.removeSocket(socket);
				});
				rooms.splice(rooms.indexOf(room), 1);
			}
		}
		else if (client.data.user && client.data.user.status === UserStatus.waiting) {
			waiting = [];
			await this.userService.updateUserStatus(client.data.user, UserStatus.undefined);
		}
	}
}