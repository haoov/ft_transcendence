import { GameEntity, UserEntity } from 'src/postgreSQL/entities';
import { Repository } from 'typeorm';
import { UserStat } from './interfaces';
export declare class HomeService {
    private readonly userRepository;
    private readonly gameRepository;
    constructor(userRepository: Repository<UserEntity>, gameRepository: Repository<GameEntity>);
    getLeaderboard(): Promise<UserStat[]>;
    getOneUserStats(username: string): Promise<UserStat>;
    getAllUserStats(): Promise<UserStat[]>;
}
