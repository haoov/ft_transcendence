import { UserStat } from './interfaces';
import { HomeService } from './home.service';
export declare class HomeController {
    private readonly homeService;
    constructor(homeService: HomeService);
    getLeaderboard(): Promise<UserStat[]>;
    getUserRank(username: string): Promise<UserStat>;
}
