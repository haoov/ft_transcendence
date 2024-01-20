import { User } from "src/user/user.interface";

export interface GameStat {
	id: number
	date: Date;
	mode: string;
	winFlag: boolean;
	opponent: User;
	userScore: number;
	opponentScore: number;
}