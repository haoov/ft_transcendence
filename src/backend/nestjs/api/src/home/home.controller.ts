import { Controller, Get, Param } from '@nestjs/common';
import { UserStat } from './interfaces';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
	constructor(private readonly homeService: HomeService) {}

	@Get("/leaderboard")
	getLeaderboard(): Promise<UserStat[]> {
	  return this.homeService.getLeaderboard();
	}

	@Get("/stats/:username")
	getUserRank(@Param('username') username :string): Promise<UserStat> {
		return this.homeService.getOneUserStats(username);
	}
}
