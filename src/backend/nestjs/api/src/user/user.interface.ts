import { Game } from "src/game/interfaces/game.interface";

export interface User {
	id: number;
	username: string;
	avatar: string;
	email: string;
	status: string;
	twofa_secret?: string;
	twofa_enabled: boolean;
	games_won: Game[]
	games_lost: Game[]
}

export interface Body2faDTO {
	twofaCode: string
};