import { Controller, Get } from '@nestjs/common';
import { Leaders } from './interfaces';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
	constructor(private readonly homeService: HomeService) {}

	@Get("/leaderboard")
	getLeaderboard(): Promise<Leaders[]> {
	  return this.homeService.getLeaderboard();
	}
}
