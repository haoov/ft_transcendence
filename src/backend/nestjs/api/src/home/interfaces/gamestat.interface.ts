import { User } from "src/user/user.interface";

export interface GameStat {
	id: number
	date: Date;
	type: string;
	winFlag: boolean;
	opponent: User;
	userScore: number;
	opponentScore: number;
}