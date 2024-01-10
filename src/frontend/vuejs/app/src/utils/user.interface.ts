import type { Game } from "./game.interface"

export interface User {
	username: string,
	avatar: string,
	email: string,
	status: string,
	games_won: Game[]
	games_lost: Game[]
}