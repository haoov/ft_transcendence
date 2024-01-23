import type { Game } from "./game.interface"

export interface User {
	id: number,
	username: string,
	avatar: string,
	twofa_enabled: boolean,
	email: string,
	status: string,
	games_won: Game[],
	games_lost: Game[]
}