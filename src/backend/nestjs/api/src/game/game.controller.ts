import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { GameService } from "./game.service";
import { Response } from "express";

@Controller("game")
export class GameController {
	constructor(private readonly gameService: GameService) {};

	@Get("params")
	getInitParams(@Res() response: Response) {
		response.send(this.gameService.initParams());
	}

	@Get("textures")
	getTexture(	@Query("color") color: string,
							@Query("displacement") displacement: string,
							@Res() response: Response) {
		const file = this.gameService.getTexture(color, displacement);
		response.send(file);
	}
};