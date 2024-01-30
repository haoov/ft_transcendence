import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { UserStat } from './interfaces';
import { StatsService } from './stats.service';
import { GameStat } from './interfaces/gamestat.interface';
import { Request } from 'express';
import { User } from 'src/user/user.interface';
import { get } from 'http';

@Controller('stats')
export class StatsController {
	constructor(private readonly statsService: StatsService) {}

	@Get("/leaderboard")
	getLeaderboard(@Req() req: Request, @Query("friends") bool: boolean): Promise<UserStat[]> {
		try {
			const user = req.user as User;
			if (bool)
				return this.statsService.getFriendsUserStats(user.id);
			else
				return this.statsService.getAllUserStats(user.id);
		}
		catch (err) {
			throw err;
		}
	}

	@Get("/user/:id")
	getUserStats(@Param('id') id :number, @Req() req: Request): Promise<UserStat> {
		try {
			return this.statsService.getOneUserStats(id, req);
		}
		catch (err) {
			throw err;
		}
	}

	@Get("/game-history/:id")
	getUserGameHistory(@Param('id') id :number): Promise<GameStat[]> {
		try {
			return this.statsService.getUserGameHistory(id);
		}
		catch (err) {
			throw err;
		}
	}
	
}
