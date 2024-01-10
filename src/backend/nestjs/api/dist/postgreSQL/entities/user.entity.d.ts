import { GameEntity } from './game.entity';
export declare class UserEntity {
    id: number;
    username: string;
    avatar: string;
    email: string;
    status: string;
    games_won: GameEntity[];
    games_lost: GameEntity[];
}
