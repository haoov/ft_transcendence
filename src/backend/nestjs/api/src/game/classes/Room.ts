import { Socket } from "socket.io";
import { Pong } from "../data/Pong";
import { Player } from "../data/player";
import { User } from "src/user/user.interface";
import { selectedParams } from "../interfaces/selectedParams";

export class Room {
	private name: string;
	private p1_id: number;
	private p1_username: string;
	private p2_id: number;
	private p2_username: string;
	private sockets: Socket[];
	public game: Pong;

	constructor(	name: string, params: selectedParams, p1: Socket[], p2?: Socket) {
		this.sockets = [];
		this.name = name;
		this.p1_id = p1[0].data.user.id;
		this.p2_id = (p2 ? p2.data.user.id : 0);
		this.p1_username = p1[0].data.user.username;
		this.p2_username = (p2 ? p2.data.user.username : "computer");

		// Update the socket infos
		p1.forEach(socket => socket.data.room = name);
		p1.forEach(socket => {socket.data.side = "right";});
		if (p2) {
			p2.data.room = name;
			p2.data.side = "left";
		}

		// Add sockets in socket tab
		p1.forEach((socket) => this.sockets.push(socket));
		if (p2)
			this.sockets.push(p2);

		// Join same room
		this.sockets.forEach(socket => {socket.join(name)});

		// Create game
		this.game = new Pong(params);
	};

	getName(): string {
		return this.name;
	}

	getGame(): Pong {
		return this.game;
	}

	getSockets(): Socket[] {
		return this.sockets;
	}

	getIds(): number[] {
		return [this.p1_id, this.p2_id];
	}

	getP1score(): number {
        return this.game.getPlayers()[0].score;
    }

    getP2score(): number {
        return this.game.getPlayers()[1].score;
    }

	getWinner() : number {
        let winner: Player;
        if (this.game.getPlayers()[0].score > this.game.getPlayers()[1].score)
            winner = this.game.getPlayers()[0];
        else
            winner = this.game.getPlayers()[1];
        if (winner.side == "right")
            return this.p1_id;
        else
            return this.p2_id;
    }

	getLoser() : number {
        let loser: Player;
        if (this.game.getPlayers()[0].score > this.game.getPlayers()[1].score)
            loser = this.game.getPlayers()[1];
        else
            loser = this.game.getPlayers()[0];
        if (loser.side == "right")
            return this.p1_id
        else
            return this.p2_id;
    }

	getWinnerUsername() : string {
		if (this.game.getPlayers()[0].score > this.game.getPlayers()[1].score)
			return this.p1_username;
		else
			return this.p2_username;
	}

	getWinnerScore() : number {
    if (this.game.getPlayers()[0].score > this.game.getPlayers()[1].score)
			return this.game.getPlayers()[0].score
    else
			return this.game.getPlayers()[1].score
	}

	getLoserScore() : number {
  	if (this.game.getPlayers()[0].score > this.game.getPlayers()[1].score)
			return this.game.getPlayers()[1].score;
  	else
			return this.game.getPlayers()[0].score;
	}

	addSocket(socket: Socket): void {
		socket.data.room = this.name;
		if (this.p1_id === socket.data.user.id)
			socket.data.side = "right";
		else if (this.p2_id === socket.data.user.id)
			socket.data.side = "left";
		this.sockets.push(socket);
		socket.join(this.name);

	}

	removeSocket(socket: Socket): void {
		const index: number = this.sockets.indexOf(socket);
		this.sockets.splice(index, 1);
		socket.leave(this.name);
		socket.data.side = "";
		socket.data.game = "";
		socket.data.room = "";
	}

}