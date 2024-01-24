import { Controller, Get, Param, Req } from '@nestjs/common';
import { UserStat } from './interfaces';
import { HomeService } from './home.service';
import { GameStat } from './interfaces/gamestat.interface';
import { Request } from 'express';
import { User } from 'src/user/user.interface';

@Controller('home')
export class HomeController {
	constructor(private readonly homeService: HomeService) {}

	@Get("/leaderboard")
	getLeaderboard(@Req() req: Request): Promise<UserStat[]> {
		const user = req.user as User;
		return this.homeService.getAllUserStats(user.id);
	}

	@Get("/stats/:id")
	getUserStats(@Param('id') id :number, @Req() req: Request): Promise<UserStat> {
		return this.homeService.getOneUserStats(id, req);
	}

	@Get("/game-history/:id")
	getUserGameHistory(@Param('id') id :number): Promise<GameStat[]> {
		return this.homeService.getUserGameHistory(id);
	}
}
