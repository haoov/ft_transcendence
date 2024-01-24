export interface UserStat {
	id: number;
	username: string;
	avatar: string;
	status: string;
	wins: number;
	win_rate: number;
	games: number;
	rank: number;
	blocking: boolean;
	blocked: boolean;
  }