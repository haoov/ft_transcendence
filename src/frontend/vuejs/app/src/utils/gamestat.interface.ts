import type { User } from "./user.interface";

export interface GameStat {
	id: number;
	date: Date;
	type: string;
	opponent: User;
	winFlag: boolean;
	userScore: number;
	opponentScore: number;
}