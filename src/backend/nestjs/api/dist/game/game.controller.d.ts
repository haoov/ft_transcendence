import { Response } from "express";
import { GameService } from "./game.service";
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    getInitParams(response: Response): void;
    getFont(response: Response): void;
    getTexture(texture: string, response: Response): void;
}
