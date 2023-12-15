import { Socket } from "socket.io";

export class Room {
	private name: string;
	private p1_name: string;
	private p2_name: string;
	private sockets: Socket[];
	private game: Game;

	constructor(name: string, p1: Socket, p2: Socket) {
		this.name = name;
		this.p1_name = p1.data.user.username;
		this.p2_name = p2.data.user.username;
		this.sockets.push(p1);
		this.sockets.push(p2);

		// Update the socket infos
		p1.data.room = name;
		p2.data.room = name;
		p1.data.side = "right";
		p2.data.side = "left";

		// Join a room
		p2.join(name);
		p1.join(name);

		// CREATE GAME et l'assigner a l'attribut game
	};

	getName(): string {
		return this.name;
	}

	addSocket(socket: Socket): void {
		this.sockets.push(socket);
	}

	removeSocket(socket: Socket): void {
		const index: number = this.sockets.indexOf(socket);
		this.sockets.splice(index, 1);

		// checker si il y a une deconnexion inattendue
	}

}