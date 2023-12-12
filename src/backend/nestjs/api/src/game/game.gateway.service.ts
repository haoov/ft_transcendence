import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { PlayerSide, PlayerStatus, ServerEvents } from "./enum";
import { Position } from "./classes";
import { User } from "src/user/user.interface";

@Injectable()
export class GameGatewayService {

	handleUserConnection(client: Socket, players: Socket[], waiting: Socket[], server: Server) {
		if (players.find((elem) => elem.data.user && elem.data.user.id == client.data.user.id)) {
			client.emit(ServerEvents.alreadyPlaying);
		} 
		else if (waiting.find((elem) => elem.data.user && elem.data.user.id == client.data.user.id)) {
			client.emit(ServerEvents.alreadyWaiting);
		}
		else if (waiting.length < 1) {
			client.data.status = PlayerStatus.waiting; 
			waiting.push(client);
			client.emit(ServerEvents.waiting);
		}
		else {
			const opponent: Socket = waiting.pop()
			// Define the sides
			opponent.data.side = PlayerSide.left;
			client.data.side = PlayerSide.right;

			// Define the status and add to players tab
			opponent.data.status = PlayerStatus.playing;
			client.data.status = PlayerStatus.playing;
			players.push(opponent);
			players.push(client);

			this.startGame(opponent, client, server);
		}
	}

	startGame(left: Socket, right: Socket, server: Server) {

		// Setting opponent
		left.data.opponent = right.data.user;
		right.data.opponent = left.data.user;

		// Joining room
		const leftUser :User = left.data.user as User;
		console.log(leftUser);
		const rigthUser :User = right.data.user as User;
		const room: string = leftUser.avatar + "+" + rigthUser.avatar;
		left.data.room = room;
		right.data.room = room;;
		left.join(room);
		right.join(room);


		// Initializing position
		const position = new Position();
		left.data.position = position.getPosition();
		right.data.position = position.getPosition()
		server.to(room).emit(ServerEvents.position, position.getPosition());
	}

	moveDot(client: Socket, data:string, players: Socket[], server: Server) {
		switch(data) {
		case "left":
			(client.data.side == PlayerSide.left) ? client.data.position.p1.x -= 5 : client.data.position.p2.x -= 5;
			break;
		case "right":
			(client.data.side == PlayerSide.left) ? client.data.position.p1.x += 5 : client.data.position.p2.x += 5;
			break;
		case "up":
			(client.data.side == PlayerSide.left) ? client.data.position.p1.y -= 5 : client.data.position.p2.y -= 5;
			break;
		case "down":
			(client.data.side == PlayerSide.left) ? client.data.position.p1.y += 5 : client.data.position.p2.y += 5;
			break;
		}
		const opponent: Socket = players.find((player) => player.data.user == client.data.opponent);
		opponent.data.position = client.data.position;
		server.to(client.data.room).emit(ServerEvents.position, client.data.position);
	}

}