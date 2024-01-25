import { Controller, Get, Param, Req } from '@nestjs/common';
import { UserStat } from './interfaces';
import { StatsService } from './stats.service';
import { GameStat } from './interfaces/gamestat.interface';
import { Request } from 'express';
import { User } from 'src/user/user.interface';

@Controller('stats')
export class StatsController {
	constructor(private readonly statsService: StatsService) {}

	@Get("/leaderboard")
	getLeaderboard(@Req() req: Request): Promise<UserStat[]> {
		const user = req.user as User;
		return this.statsService.getAllUserStats(user.id);
	}

	@Get("/user/:id")
	getUserStats(@Param('id') id :number, @Req() req: Request): Promise<UserStat> {
		return this.statsService.getOneUserStats(id, req);
	}

	@Get("/game-history/:id")
	getUserGameHistory(@Param('id') id :number): Promise<GameStat[]> {
		return this.statsService.getUserGameHistory(id);
	}
}
