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
	friends: User[]
	users_blocked: User[]
}

export interface UserRelation {
	id: number;
	username: string;
	avatar: string;
	status: string;
	blocking: boolean;
	blocked: boolean;
	friend: boolean | string;
  }

export interface Body2faDTO {
	twofaCode: string
};