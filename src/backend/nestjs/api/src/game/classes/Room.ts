import { Socket } from "socket.io";
import { Position } from "./Position";
import { PositionInterface } from "../interfaces";

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

		// Push sockets
		p1.forEach((socket) => this.sockets.push(socket));
		//this.sockets.concat(p1);
		this.sockets.push(p2);

		// Join same room
		this.sockets.forEach(socket => {socket.join(name)});

		// Create game
		this.game = new Position();
	};

	destructor(): void {
		console.log("destructor called");
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

		// checker si il y a une deconnexion inattendue
	}

}