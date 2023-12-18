import { Socket } from "socket.io";
import { Position } from "./Position";

export class Room {
	private name: string;
	private p1_name: string;
	private p2_name: string;
	private sockets: Socket[];
	public game: Position;

	constructor(name: string, p1: Socket[], p2: Socket) {
		this.sockets = [];
		this.name = name;
		this.p1_name = p1[0].data.user.username;
		this.p2_name = p2.data.user.username;

		// Update the socket infos
		p1.forEach(socket => socket.data.room = name);
		p1.forEach(socket => {socket.data.side = "right";});
		p2.data.room = name;
		p2.data.side = "left";

		// Add sockets in socket tab
		p1.forEach((socket) => this.sockets.push(socket));
		this.sockets.push(p2);

		// Join same room
		this.sockets.forEach(socket => {socket.join(name)});

		// Create game
		this.game = new Position();
	};

	getName(): string {
		return this.name;
	}

	getGame(): Position {
		return this.game;
	}

	getSockets(): Socket[] {
		return this.sockets;
	}

	getP1score(): number {
		return this.game.score_p1;
	}

	getP2score(): number {
		return this.game.score_p2;
	}

	getWinner() {
		var winner: string;
		this.game.score_p1 > this.game.score_p2 ? winner = this.p1_name : winner = this.p2_name;
		return winner;
	}

	addSocket(socket: Socket): void {
		socket.data.room = this.name;
		if (this.p1_name === socket.data.user.username)
			socket.data.side = "right";
		else if (this.p2_name === socket.data.user.username)
			socket.data.side = "left";
		this.sockets.push(socket);
		socket.join(this.name);

	}

	removeSocket(socket: Socket): void {
		const index: number = this.sockets.indexOf(socket);
		this.sockets.splice(index, 1);
		socket.leave(this.name);

	}

}