import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { PlayerSide, ServerEvents } from "./enum";
import { UserStatus } from "src/user/enum/userStatus.enum";
import { PositionInterface } from "./interfaces";
import { Room } from "./classes/Room";
import { UserService } from "src/user/user.service";

@Injectable()
export class GameGatewayService {

	constructor(private readonly userService: UserService) {}

	async handleUserConnection(client: Socket, rooms: Room[], waiting: Socket[], server: Server) {
		if (client.data.user.status === UserStatus.playing) {
			const room: Room = this.findRoom(client, rooms);
			room.addSocket(client);
		} 
		else if (client.data.user.status === UserStatus.waiting) {
			client.emit(ServerEvents.alreadyWaiting);
		}
		if (waiting.length < 1) {
			this.userService.updateUserStatus(client.data.user, UserStatus.waiting);
			waiting.push(client);
			client.emit(ServerEvents.waiting);
		}
		else {
			// Empty the 'waiting' tab
			const opponent: Socket = waiting.pop()
	

			// Define the status
			this.userService.updateUserStatus(client.data.user, UserStatus.playing);
			this.userService.updateUserStatus(opponent.data.user, UserStatus.playing);

			this.startGame(opponent, client, rooms, server);
		}
	}

	startGame(p1: Socket, p2: Socket, rooms: Room[], server: Server) {

		const name: string = rooms.length.toString();
		const room: Room = new Room(name, p1, p2)
		rooms.push(room);

		// Initializing position
		// const position = new Position();
		// left.data.position = position.getPosition();
		// right.data.position = position.getPosition()
		// server.to(room).emit(ServerEvents.position, position.getPosition());
	}

	findRoom(client: Socket, rooms: Room[]) : Room {
		return rooms.find((room) => { client.data.room === room.getName()});
	}

	moveDot(client: Socket, data:string, players: Socket[], server: Server) {
		if (client.data.status === UserStatus.playing) {	
			const position = client.data.position as PositionInterface;	
			const side = client.data.side as Number;	
			switch(data) {
			case "left":
				(side == PlayerSide.left) ? position.p1.x -= 5 : position.p2.x -= 5;
				break;
			case "right":
				(side == PlayerSide.left) ? position.p1.x += 5 : position.p2.x += 5;
				break;
			case "up":
				(side == PlayerSide.left) ? position.p1.y -= 5 : position.p2.y -= 5;
				break;
			case "down":
				(side == PlayerSide.left) ? position.p1.y += 5 : position.p2.y += 5;
				break;
			}
			//const opponent: Socket = players.find((player) => player.data.user == client.data.opponent);
			client.data.opponent.data.position = client.data.position;
			server.to(client.data.room).emit(ServerEvents.position, client.data.position);
		}
	}

	handleUserDisconnection(client: Socket, rooms: Room[], waiting: Socket[], server: Server) {
		if (client.data.user.status === UserStatus.playing) {
			this.findRoom(client, rooms).removeSocket(client);
		}
		else if (client.data.user.status === UserStatus.waiting) {
			waiting.pop();
		}
	}
}