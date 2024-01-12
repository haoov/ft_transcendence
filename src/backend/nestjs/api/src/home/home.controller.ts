import { Controller, Get, Param } from '@nestjs/common';
import { UserStat } from './interfaces';
import { HomeService } from './home.service';
import { GameStat } from './interfaces/gamestat.interface';

@Controller('home')
export class HomeController {
	constructor(private readonly homeService: HomeService) {}

	@Get("/leaderboard")
	getLeaderboard(): Promise<UserStat[]> {
	  return this.homeService.getAllUserStats();
	}

	@Get("/stats/:id")
	getUserStats(@Param('id') id :number): Promise<UserStat> {
		return this.homeService.getOneUserStats(id);
	}

	@Get("/game-history/:id")
	getUserGameHistory(@Param('id') id :number): Promise<GameStat[]> {
		return this.homeService.getUserGameHistory(id);
	}
}
