/// <reference types="node" />
import { UserService } from "src/user/user.service";
import { GameEntity } from "src/postgreSQL/entities";
import { Repository } from "typeorm";
import { Game } from "./interfaces/game.interface";
export declare class GameService {
    private userService;
    private gameRepository;
    constructor(userService: UserService, gameRepository: Repository<GameEntity>);
    initParams(): {
        window: {
            WIDTH: number;
            HEIGHT: number;
        };
        cam: {
            FOV: number;
            ASPECT: number;
            NEARZ: number;
            FARZ: number;
            ZPOS: number;
        };
        params: {
            FIELD_WIDTH: number;
            FIELD_HEIGHT: number;
            PADDLE_WIDTH: number;
            PADDLE_HEIGHT: number;
            PADDLE_DEPTH: number;
            BALL_RADIUS: number;
        };
        colors: {
            WHITE: number;
        };
    };
    getFont(): Buffer;
    getTexture(texture: string): Buffer;
    createGame(game: Game): Promise<Game>;
}
