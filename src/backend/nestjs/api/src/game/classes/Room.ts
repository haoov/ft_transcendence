import { Server, Socket } from "socket.io";
import { Pong } from "../data/Pong";
import { gameParams } from "../interfaces/gameParams";
import { User } from "src/user/user.interface";
import { Game } from "../interfaces/game.interface";

const computer = {
	id: 0, 
	username: "computer", 
	status: "undefined",
	avatar: "",
	email: "",
	games_won: [],
	games_lost: [],
	twofa_enabled: false,
	twofa_auth: false,
	twofa_secret: ""
};

export class Room {
	private name: string;
	private public: boolean;
	private full: boolean;
	private users: User[];
	private sockets: Socket[];
	private params: gameParams;
	private game: Pong;

	constructor(name: string, params: gameParams) {
		this.users = [];
		this.name = name;
		this.public = true;
		this.full = false;
		this.sockets = [];
		this.params = params;
		this.game = new Pong(params);
	}

	startGame(): void {
		this.game.start();
	}

	stopGame(): void {
		this.game.stop();
	}

	getUsers(): User[] {
		return this.users;
	}

	addSocket(socket: Socket): void {
		socket.data.room = this.name;
		this.sockets.push(socket);
		socket.join(this.name);
	}

	removeSocket(socket: Socket): void {
		this.sockets.splice(this.sockets.indexOf(socket), 1);
		socket.leave(this.name);
	}

	addUser(user: User): void {
		if (!this.isFull()) {
			this.users.push(user);
			if (this.users.length > 1)
				this.full = true;
		}
	}

	getType(): string {
		return this.params.game;
	}

	getName(): string {
		return this.name;
	}

	isPublic(): boolean {
		return this.public;
	}

	isFull(): boolean {
		return this.full;
	}

	getSockets(): Socket[] {
		return this.sockets;
	}

	getWinner(): User {
		if (this.game.getPlayers()[0].score > this.game.getPlayers()[1].score)
			return this.users[0];
		else {
			if (this.users.length > 1)
				return this.users[1];
			else
				return computer;
		}
	}

	getLoser(): User {
		if (this.game.getPlayers()[0].score < this.game.getPlayers()[1].score)
			return this.users[0];
		else {
				return this.users[1];
		}
	}

	getScore(user: User): number {
		if (this.users[0].id == user.id)
			return this.game.getPlayers()[0].score;
		else
			return this.game.getPlayers()[1].score;
	}

	getParams(): gameParams {
		return this.params;
	}

	getGameData(): any {
		return this.game.getData();
	}

	gameMove(socket: Socket, direction: string): void {
		const side: string = (socket.data.user.id == this.users[0].id ? "right" : "left");
		this.game.movePaddle(side, direction);
	}

	gameUseSpell(socket: Socket, type: string): void {
		const side: string = (socket.data.user.id == this.users[0].id ? "right" : "left");
		this.game.useSpell(side, type);
	}

	quitGame(socket: Socket): void {
		console.log(socket.data.user.username + " quitGame");
		if (socket.data.user.id == this.users[0].id)
			this.game.getPlayers()[1].topScore();
		else
			this.game.getPlayers()[0].topScore();
	}

	isOpen(): boolean {
		return (this.public && !this.full);
	}

	checkSockets(user: User): boolean {
		if (this.sockets.find((socket) => {return (socket.data.user.id == user.id);}))
			return true;
		else
			return false;
	}

	getStats(): Game {
		const winner: User = this.getWinner();
		const loser: User = this.getLoser();
		const stats: Game = {
			game: this.params.game,
			winner: winner,
			loser: loser,
			winner_score: this.getScore(winner),
			loser_score: this.getScore(loser),
		};
		return stats;
	}
}
