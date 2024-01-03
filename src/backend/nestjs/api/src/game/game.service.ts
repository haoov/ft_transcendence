import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { readFileSync } from "fs";
import { Pong } from "./data/Pong";
import { InjectRepository } from "@nestjs/typeorm";
import { GameEntity } from "src/postgreSQL/entities";
import { Repository } from "typeorm";
import { Game } from "./interfaces/game.interface";

@Injectable()
export class GameService {

	constructor(private userService: UserService,
		@InjectRepository(GameEntity) private gameRepository: Repository<GameEntity>) {}

	initParams() {
		return (new Pong("classic").initParams());
	}

	getFont() {
		return readFileSync("src/game/data/fonts/helvetiker_regular.typeface.json");
	}

	getTexture(texture: string) {
		switch (texture) {
			case "ice":
				return readFileSync("src/game/data/textures/ice.color.jpg");
			case "fire":
				return readFileSync("src/game/data/textures/fire.color.png")
			case "tennisCourt":
				return readFileSync("src/game/data/textures/tennis_court.jpeg");
			case "questionMark":
				return readFileSync("src/game/data/textures/questionMark.jpeg");
			default: break;
		}
	}

	async createGame(game: Game): Promise<Game> {
		try {
			this.gameRepository.create(game as GameEntity);
			return this.gameRepository.save(game as GameEntity) as Promise<Game>;
		}
		catch (err) {
			// Cas d'erreurs
			console.log("error in game")
		}
		return null;
	}

};