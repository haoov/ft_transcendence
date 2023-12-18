import { Ball } from "./ball";
import { Effect } from "./effect";
import { Field } from "./field";
import { cam, colors, params, window } from "./opts";
import { Player } from "./player";

class Pong {
	private players: Player[];
	private ball: Ball;
	private field: Field;
	private effect: Effect;
	private started: boolean;

	constructor() {
		this.players = [];
		this.field = new Field();
		this.players.push(new Player("right", this.field));
		this.players.push(new Player("left", this.field));
		this.ball = new Ball();
		this.effect = new Effect();
		this.started = false;
	}

	movePaddle(side: string, direction: string) {
		const player: Player = this.players.find((currentPlayer) => {return (currentPlayer.side == side);});
		if (direction == "up")
			player.paddle.position.y += player.paddle.speed;
		if (direction == "down")
			player.paddle.position.y -= player.paddle.speed;
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

	start() {
		this.started = true;
	}

	update() {
		if (this.started) {
			this.ball.moove(this.players, this.field, this.effect);
			this.effect.moove(this.field);
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
};

export { Pong };