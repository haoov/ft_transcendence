import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { GameService } from "./game.service";

@Controller("game")
export class GameController {
	constructor(private readonly gameService: GameService) {};

	@Get("params")
	getInitParams(@Res() response: Response) {
		response.send(this.gameService.initParams());
	}

	@Get("fonts")
	getFont(@Res() response: Response) {
		const file = this.gameService.getFont();
		response.send(file);
	}

	@Get("textures")
	getTexture(	@Query("texture") texture: string, @Res() response: Response) {
		const file = this.gameService.getTexture(texture);
		response.send(file);
	}
};