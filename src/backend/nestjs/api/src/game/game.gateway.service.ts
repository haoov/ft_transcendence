import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { ServerEvents } from "./enum";
import { UserStatus } from "src/user/enum/userStatus.enum";
import { Room } from "./classes";
import { UserService } from "src/user/user.service";
import { GameService } from "./game.service";

@Injectable()
export class GameGatewayService {

	constructor(private readonly userService: UserService,
				private readonly gameService: GameService) {}

	assignMode(client: Socket,
				params: string[],
				classic_r: Room[],
				classic_w: Socket[],
				super_r: Room[],
				super_w: Socket[],
				server:Server) {
		client.data.mode = params[0];
		console.log(params)
		if (params[0] === "classic")
			this.manageUserGame(client, classic_r, classic_w, server);
		else if (params[0] === "super") {
			console.log("ici");
			this.manageUserGame(client, super_r, super_w, server);
		}

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


	move(client: Socket, direction: string, rooms: Room[]) {
		const room: Room = this.findRoom(client, rooms);
		room.getGame().movePaddle(client.data.side, direction);
	}


	async finishGame(room: Room, rooms: Room[], server: Server) {
		// Emit finish event
		server.to(room.getName()).emit(ServerEvents.finished);
		
		// Add game in database
		var winnerUser = await this.userService.getUserById(room.getWinner());
		var loserUser = await this.userService.getUserById(room.getLoser());
		await this.gameService.createGame({
			mode: room.getSockets()[0].data.mode,
			winner: winnerUser,
			loser: loserUser,
			winner_score: room.getWinnerScore(),
			loser_score: room.getLoserScore(),
		});
		console.log("game added to db");

		// Reset status for user
		room.getSockets().forEach(async (socket) => {
			await this.userService.updateUserStatus(socket.data.user, UserStatus.undefined);
			this.resetSocket(socket);
		});

		// Delete room
		rooms.splice(rooms.indexOf(room), 1);
	}

	socketCount(client: Socket, room: Room) {
		let count: number = 0;
		const sockets: Socket[] = room.getSockets();
		for(let i = 0; i < sockets.length; i++) {
			if (sockets[i].data.user.id === client.data.user.id)
				count++;
		}
		return count;
	}

	resetSocket(socket: Socket) {
		socket.data.mode = "";
		socket.data.side = "";
		socket.data.room = "";
	}

	async handleUserDisconnection(client: Socket, rooms: Room[], waiting: Socket[], server: Server) {
		if (client.data.user && client.data.user.status === UserStatus.playing) {
			const room: Room = this.findRoom(client, rooms);
			if (client.data.side == "right")
				room.getGame().getPlayers()[1].topScore()
			else
				room.getGame().getPlayers()[0].topScore()
			// A DECOMMENTER APRES
			// if (room && this.socketCount(client, room) === 1) {
			// 	this.finishGame(room, rooms, server);
			// }
			// else if (room) {
			// 	room.removeSocket(client);
			// }
			// A ENLEVER APRES
			this.finishGame(room, rooms, server)
		}
		else if (client.data.user && client.data.user.status === UserStatus.waiting) {
			waiting.length = 0;
			await this.userService.updateUserStatus(client.data.user, UserStatus.undefined);
			this.resetSocket(client);
		}
	}
}