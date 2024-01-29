export type GameSpellType = "fire" | "ice" | "small" | "big"

export type GameState = "noGame" | "waiting" | "ready" | "play" | "started" | "finished"

export interface GameSpell {
	type: GameSpellType,
	icon: string,
	on: boolean,
}

export interface GamePlayer {
	username: string,
	avatar: string,
	score: number,
	spells: GameSpell[],
}