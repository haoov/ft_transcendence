import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { ServerEvents } from "./enum";
import { UserStatus } from "src/user/enum/userStatus.enum";
import { Room, Position } from "./classes";
import { UserService } from "src/user/user.service";

@Injectable()
export class GameGatewayService {

	constructor(private readonly userService: UserService) {}

	async handleUserConnection(client: Socket, rooms: Room[], waiting: Socket[], server: Server) {
		if (client.data.user.status === UserStatus.playing) {
			const room: Room = this.findRoom(client, rooms);
			room.addSocket(client);
			server.to(room.getName()).emit(ServerEvents.position, room.game.getPosition());
		} 
		else if (client.data.user.status === UserStatus.waiting || waiting.length < 1) {
			if (client.data.user.status !== UserStatus.waiting)
				await this.userService.updateUserStatus(client.data.user, UserStatus.waiting);
			waiting.push(client);
			//client.join(client.data.user.username);
			client.emit(ServerEvents.waiting);
		}
		else {
			// Empty the 'waiting' tab
			const opponent: Socket[] = [...waiting];
			waiting = [];
			console.log(opponent.length);
	


			// Define the status
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
			if (sockets[i].data.user.username === client.data.user.username)
				count++;
		}
		return count;
	}

	moveDot(client: Socket, data:string, rooms: Room[], server: Server) {
		if (client.data.user.status === UserStatus.playing) {
			const room: Room = this.findRoom(client, rooms);
			const position = room.getGame();	
			const side = client.data.side;
			room.getSockets().forEach((socket) => {console.log(socket.data.user, socket.data.side)});
			switch(data) {
			case "left":
				(side == "left") ? position.p1.x -= 5 : position.p2.x -= 5;
				break;
			case "right":
				(side == "left") ? position.p1.x += 5 : position.p2.x += 5;
				break;
			case "up":
				(side == "left") ? position.p1.y -= 5 : position.p2.y -= 5;
				break;
			case "down":
				(side == "left") ? position.p1.y += 5 : position.p2.y += 5;
				break;
			}
			server.to(room.getName()).emit(ServerEvents.position, position.getPosition());
		}
	}

	// Clean up la deconnexion et envoyer un event
	handleUserDisconnection(client: Socket, rooms: Room[], waiting: Socket[], server: Server) {
		if (client.data.user && client.data.user.status === UserStatus.playing) {
			const room: Room = this.findRoom(client, rooms);
			room.removeSocket(client);
			if (this.getRoomSocketCount(client, rooms) === 0) {
				const index: number = rooms.findIndex((r) => {r === room})
				rooms.splice(index, 1);
				this.userService.updateUserStatus(client.data.user, UserStatus.undefined);
			}
		}
		else if (client.data.user && client.data.user.status === UserStatus.waiting) {
			waiting.splice(0, waiting.length);
			this.userService.updateUserStatus(client.data.user, UserStatus.undefined);
		}
	}
}