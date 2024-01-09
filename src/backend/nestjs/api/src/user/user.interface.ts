import { Game } from "src/game/interfaces/game.interface";

export interface User {
	username: string,
	avatar: string,
	email: string,
	status: string,
	games_won: Game[]
	games_lost: Game[]
}