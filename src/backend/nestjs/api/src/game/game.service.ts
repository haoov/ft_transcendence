import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { Player } from "./data/player";
import { Ball } from "./data/ball";
import { Field } from "./data/field";
import { cam, colors, params, window } from "./data/opts";
import { readFileSync } from "fs";
import { Effect } from "./data/effect";

@Injectable()
export class GameService {
	players: Player[];
	ball: Ball;
	field: Field;
	effect: Effect;

	constructor(private userService: UserService) {
		this.players = [];
		this.ball = new Ball();
		this.field = new Field();
		this.effect = new Effect();
	}

	initParams() {
		return {
			window: window,
			cam: cam,
			params: {
				FIELD_WIDTH: this.field.width,
				FIELD_HEIGHT: this.field.height,
				PADDLE_WIDTH: params.PADDLE_WIDTH,
				PADDLE_HEIGHT: params.PADDLE_HEIGHT,
				PADDLE_DEPTH: params.PADDLE_DEPTH,
				BALL_RADIUS: params.BALL_RADIUS,
			},
			colors: colors
		};
	}

	addPlayer(socketId: string, user: User) {
		const playerId = (this.players.length == 0 ? 1 : 2);
		this.players.push(new Player(user, socketId, playerId, this.field));
	}

	movePaddle(socketId: string, direction: string) {
		const player: Player = this.players.find((currentPlayer) => {return (currentPlayer.socketId == socketId)});
		if (direction == "up")
			player.paddle.position.y += player.paddle.speed;
		if (direction == "down")
			player.paddle.position.y -= player.paddle.speed;
	}

	update() {
		if (this.players.length == 2) {
			this.effect.moove(this.field);
			this.ball.moove(this.players, this.field, this.effect);
		}
		return {
			ballPosition: this.ball.position,
			ballScale: this.ball.scale,
			ballEffect: (this.ball.effect != null ? this.ball.effect.type : "none"),
			p1PaddlePosition: this.players[0]?.paddle.position,
			p1PaddleScale: this.players[0]?.paddle.scale,
			p1Effect: (this.players[0]?.paddle.effect != null ? this.players[0]?.paddle.effect.type : "none"),
			p2PaddlePosition: this.players[1]?.paddle.position,
			p2PaddleScale: this.players[1]?.paddle.scale,
			p2Effect: (this.players[1]?.paddle.effect != null ? this.players[1]?.paddle.effect.type : "none"),
			effectPosition: this.effect.position,
			effectRotationSpeed: this.effect.rotationSpeed,
			effectOn: this.effect.on,
		};
	}

	reset() {
		this.ball.reset();
		for (let i = 0; i < this.players.length; ++i)
			this.players[i].paddle.reset();
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