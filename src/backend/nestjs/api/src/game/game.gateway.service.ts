import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { PlayerSide, ServerEvents } from "./enum";
import { UserStatus } from "src/user/enum/userStatus.enum";
import { Position } from "./classes";
import { User } from "src/user/user.interface";
import { PositionInterface } from "./interfaces";

@Injectable()
export class GameGatewayService {

	handleUserConnection(client: Socket, players: Socket[], waiting: Socket[], server: Server) {
		// if (players.find((elem) => elem.data.user && elem.data.user.id == client.data.user.id)) {
		// 	client.emit(ServerEvents.alreadyPlaying);
		// } 
		// else if (waiting.find((elem) => elem.data.user && elem.data.user.id == client.data.user.id)) {
		// 	client.emit(ServerEvents.alreadyWaiting);
		// }
		if (waiting.length < 1) {
			client.data.status = UserStatus.waiting; 
			waiting.push(client);
			client.emit(ServerEvents.waiting);
		}
		else {
			// Empty the 'waiting' tab
			const opponent: Socket = waiting.pop()
	
			// Define the sides
			opponent.data.side = PlayerSide.left;
			client.data.side = PlayerSide.right;

			// Define the status and add to 'players' tab
			opponent.data.status = UserStatus.playing;
			client.data.status = UserStatus.playing;
			players.push(opponent);
			players.push(client);

			this.startGame(opponent, client, server);
		}
	}

	startGame(left: Socket, right: Socket, server: Server) {

		// Setting opponent
		left.data.opponent = right;
		right.data.opponent = left;

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
		server.to(room).emit(ServerEvents.position, position.getPosition());
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

	handleUserDisconnection(client: Socket, players: Socket[], waiting: Socket[], server: Server) {
		if (client.data.status === UserStatus.playing) {
			for(let i: number = 0; i < players.length; i++) {
				if (players[i].data.user.id == client.data.user.id) {
					players.splice(i, 1);
					//break;
				}
			}
			// FONCTION RESET : opponent field  + envoyer un event connection lost
		}
		else if (client.data.status === UserStatus.waiting) {
			// for(let i: number = 0; i < waiting.length; i++) {
			// 	if (waiting[i].data.user.id == client.data.user.id) {
			// 		waiting.splice(i, 1);
			// 		//break;
			// 	}
			// }
			waiting.pop();
		}
	}
}