import { gameParams } from "../interfaces/gameParams";
import { Ball } from "./ball";
import { Effect } from "./effect";
import { Field } from "./field";
import { cam, colors, params, window, rules } from "./opts";
import { Player } from "./player";

class Pong {
	private players: Player[];
	private ball: Ball;
	private field: Field;
	private effect: Effect;
	private started: boolean;
	private finished: boolean;
	private game: string;
	private mode: string;
	private difficulty: string;

	constructor(params: gameParams) {
		this.game = params.game;
		this.mode = params.mode;
		this.difficulty = params.difficulty;
		this.players = [];
		this.field = new Field();
		this.players.push(new Player("right", this.field));
		this.players.push(new Player("left", this.field));
		this.ball = new Ball();
		this.effect = new Effect();
		this.started = false;
		this.finished = false;
	}

	movePaddle(side: string, direction: string) {
		const player: Player = this.players.find((currentPlayer) => {return (currentPlayer.side == side);});
		if (direction == "up")
			player.paddle.move(direction, this.field);
		if (direction == "down")
			player.paddle.move(direction, this.field);
	}

	useSpell(side: string, type: string) {
		const player: Player = this.players.find((currentPlayer) => {return (currentPlayer.side == side);});
		if (player.spellBook.spellEnabled(type))
			player.spellBook.useSpell(type, this.ball, player.paddle);
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
		this.compute();
	}

	stop() {
		this.started = false;
	}

	async compute() {

		if (this.started) {
			if (this.game == "super") {
				this.ball.moove(this.players, this.field, this.effect);
				this.effect.moove(this.field);
			}
			else
				this.ball.moove(this.players, this.field);
			if (this.mode == "singlePlayer")
				this.players[1].paddle.autoMove(this.ball, this.field, this.difficulty);
			for (let i = 0; i < this.players.length; ++i) {
				if (this.players[i].score == rules.WIN_SCORE)
					this.finished = true;
			}
			setTimeout(() => {this.compute();}, 8.333);
		}
	}

	reset() {
		this.ball.reset();
		for (let i = 0; i < this.players.length; ++i)
			this.players[i].paddle.reset();
	}

	getPlayers(): Player[] {
		return this.players;
	}

	getMode(): string {
		return this.mode;
	}

	getData() {
		return {
			ballPosition: this.ball.position,
			ballScale: this.ball.scale,
			ballEffect: this.ball.getEffect(),
			p1PaddlePosition: this.players[0].paddle.position,
			p1PaddleScale: this.players[0].paddle.scale,
			p1Effect: this.players[0].paddle.effect,
			p1Spells: this.players[0].spellBook.getSpells(),
			p2PaddlePosition: this.players[1].paddle.position,
			p2PaddleScale: this.players[1].paddle.scale,
			p2Effect: this.players[1].paddle.effect,
			p2Spells: this.players[1].spellBook.getSpells(),
			effectPosition: this.effect.position,
			effectRotationSpeed: this.effect.rotationSpeed,
			effectOn: this.effect.on,
			p1Score: this.players[0].score,
			p2Score: this.players[1].score,
			finished: this.finished,
		};
	}
};

export { Pong };