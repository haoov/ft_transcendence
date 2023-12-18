import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { ServerEvents } from "./enum";
import { UserStatus } from "src/user/enum/userStatus.enum";
import { Room } from "./classes";
import { UserService } from "src/user/user.service";

@Injectable()
export class GameGatewayService {

	constructor(private readonly userService: UserService) {}

	async handleUserConnection(client: Socket, rooms: Room[], waiting: Socket[], server: Server) {
		// if (client.data.user.status === UserStatus.playing) {
		// 	const room: Room = this.findRoom(client, rooms);
		// 	room.addSocket(client);
		// 	server.to(room.getName()).emit(ServerEvents.position, room.game.getPosition());
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

			this.startGame(opponent, client, rooms, server);
		}
	}

	async startGame(p1: Socket[], p2: Socket, rooms: Room[], server: Server) {
		const name: string = rooms.length.toString();
		const room: Room = new Room(name, p1, p2)
		rooms.push(room);
		server.to(room.getName()).emit(ServerEvents.position, room.game.getPosition());
		server.to(room.getName()).emit(ServerEvents.position, room.game.getPosition());

	}

	findRoom(client: Socket, rooms: Room[]) : Room {
		return rooms.find((room) => { 
			const sockets: Socket[] = room.getSockets();
			return sockets.find((socket) => socket.data.user.username === client.data.user.username)
		});
	}

	getRoomSocketCount(client: Socket, rooms: Room[]) : number {
		const room: Room = this.findRoom(client, rooms);
		if (!room)
			return 0;
		const sockets = room.getSockets();
		var count: number = 0;
		for (var i = 0; i < sockets.length; i++) {
			if (sockets[i].data.user.id === client.data.user.id)
				count++;
		}
		return count;
	}

	moveDot(client: Socket, data:string, rooms: Room[], server: Server, waiting: Socket[]) {
		if (client.data.user.status === UserStatus.playing) {
			const room: Room = this.findRoom(client, rooms);
			const game = room.getGame();	
			const side = client.data.side;
			switch(data) {
			case "left":
				(side == "left") ? game.p1.x -= 5: game.p2.x -= 5;
				break;
			case "right":
				(side == "left") ? game.p1.x += 5 : game.p2.x += 5;
				break;
			case "up":
				(side == "left") ? game.p1.y -= 5 : game.p2.y -= 5;
				break;
			case "down":
				(side == "left") ? game.p1.y += 5 : game.p2.y += 5;
				break;
			}
			(side == "left") ? game.score_p1++ : game.score_p2++;
			server.to(room.getName()).emit(ServerEvents.position, game.getPosition());
			if (game.isFinished()) {
				server.to(room.getName()).emit(ServerEvents.finished);
				this.finishGame(room, rooms, waiting, server);
			}
		}
	}

	finishGame(room: Room, rooms: Room[], waiting: Socket[], server: Server) {
		room.getSockets().forEach(async (socket) => {
			await this.userService.updateUserStatus(socket.data.user, UserStatus.undefined);
			socket.data.side = "";
		});
		rooms.splice(rooms.indexOf(room), 1);
		// Database management
	}

	async handleUserDisconnection(client: Socket, rooms: Room[], waiting: Socket[], server: Server) {
		if (client.data.user && client.data.user.status === UserStatus.playing) {
			const room: Room = this.findRoom(client, rooms);
			if (room && room.removeSocket(client) == 0) {
				const index: number = rooms.indexOf(room);
				rooms.splice(index, 1);
				await this.userService.updateUserStatus(client.data.user, UserStatus.undefined);
				// Indiquer le deconnexion
				//server.to(room.getName()).emit(ServerEvents.disconnect);
			}
		}
		else if (client.data.user && client.data.user.status === UserStatus.waiting) {
			waiting = [];
			await this.userService.updateUserStatus(client.data.user, UserStatus.undefined);
		}
	}
}