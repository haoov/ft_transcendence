import { Socket } from "socket.io";
import { Pong } from "../data/Pong";
import { GameMap, GameParams } from "../interfaces/gameParams";
import { User } from "src/user/user.interface";
import { Game } from "../interfaces/game.interface";

const maps: GameMap[] = ["space", "tennis", "classic"];

const computer = {
	id: 0, 
	username: "computer", 
	status: "undefined",
	avatar: "",
	email: "",
	games_won: [],
	games_lost: [],
	friends: [],
	twofa_enabled: false,
	twofa_auth: false,
	twofa_secret: "",
	users_blocked: [],
};

export class Room {
	private name: string;
	private public: boolean;
	private full: boolean;
	private closed: boolean;
	private users: User[];
	private sockets: Socket[];
	private params: GameParams;
	private game: Pong;

	constructor(name: string, params: {gameParams: GameParams, setPrivate?: boolean}) {
		this.users = [];
		this.name = name;
		this.public = (params.setPrivate ? false : true);
		this.full = false;
		this.closed = false;
		this.sockets = [];
		this.params = params.gameParams;
		if (params.gameParams.map == "random")
			this.params.map = maps[Math.floor(Math.random() * maps.length)];
		else
			this.params.map = params.gameParams.map;
		this.game = new Pong(params.gameParams);
	}

	startGame(): void {
		this.closed = true;
		this.game.start();
	}

	stopGame(): void {
		this.game.stop();
	}

	getUsers(): User[] {
		return this.users;
	}

	addSocket(socket: Socket): void {
		if (this.sockets.find((s) => {return (s.id == socket.id);})) {
			return;
		}
		socket.data.room = this.name;
		this.sockets.push(socket);
		socket.join(this.name);
		this.checkFull();
	}

	removeSocket(socket: Socket): void {
		if (this.sockets.find((s) => {return (s.id == socket.id);})) {
			this.sockets.splice(this.sockets.indexOf(socket), 1);
			socket.leave(this.name);
		}
	}

	addUser(user: User): void {
		if (!this.isFull()) {
			this.users.push(user);
			this.checkFull();
		}
	}

	checkFull(): void {
		let count = 0;
		this.users.forEach((user) => {
			if (this.sockets.find((socket) => {return (socket.data.user.id == user.id);}))
				++count;
		});
		if (count == 2)
			this.full = true;
	}

	getType(): string {
		return this.params.mode;
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

	isClosed(): boolean {
		return this.closed;
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

	getParams(): GameParams {
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

	quitGame(user: User): void {
		if (user.id == this.users[0].id)
			this.game.getPlayers()[1].topScore();
		else
			this.game.getPlayers()[0].topScore();
	}

	close(): void {
		this.closed = true;
	}

	isOpen(): boolean {
		return (!this.closed);
	}

	isAvailable(): boolean {
		return (this.public && !this.full && !this.closed);
	}

	hasUser(user: User): boolean {
		const userIn: User = this.users.find((u) => {return (u.id == user.id);});
		if (userIn)
			return true;
		else
			return false;
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
			mode: this.params.mode,
			winner: winner,
			loser: loser,
			winner_score: this.getScore(winner),
			loser_score: this.getScore(loser),
		};
		return stats;
	}
}
