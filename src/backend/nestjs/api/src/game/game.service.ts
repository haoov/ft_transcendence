import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { readFileSync } from "fs";
import { Pong } from "./data/Pong";

@Injectable()
export class GameService {

	constructor(private userService: UserService) {}

	initParams() {
		return (new Pong().initParams());
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

};