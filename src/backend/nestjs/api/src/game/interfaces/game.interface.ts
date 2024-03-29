import { User } from "src/user/user.interface";

export interface Game {
	mode: string;
	winner: User;
	loser: User;
	winner_score: number;
	loser_score: number;
}