import { UserEntity } from './user.entity';
export declare class GameEntity {
    id: number;
    game: string;
    winner: UserEntity;
    loser: UserEntity;
    winner_score: number;
    loser_score: number;
    date: Date;
}
