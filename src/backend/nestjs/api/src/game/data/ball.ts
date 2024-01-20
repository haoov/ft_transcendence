import { ConsoleLogger } from "@nestjs/common";
import { Effect } from "./effect";
import { Field } from "./field";
import { Vec3, params } from "./opts"
import { Paddle } from "./paddle";
import { Player } from "./player";

class Ball {
	speed: number;
	position: Vec3;
	vecSpeed: Vec3;
	scale: Vec3;
	radius: number;
	effect: string;
	lastHit: Player;
	started: boolean;

	constructor() {
		this.position = {x: 0, y: 0, z: 0};
		this.speed = params.BALL_SPEED;
		this.vecSpeed = {x: 0, y: 0, z: 0};
		this.effect = "none";
		this.radius = params.BALL_RADIUS;
		this.scale = {x: 1, y: 1, z: 1};
		this.started = false;
	}

	start() {
		this.started = true;
		setTimeout(() => {
			const direction: number = (Math.random() > 0.5 ? 1 : -1);
			this.vecSpeed.x = params.BALL_SPEED * direction;
		}, 1000);
	}

	moove(players: Player[], field: Field, effect?: Effect) {
		this.position.x += this.vecSpeed.x;
		this.position.y += this.vecSpeed.y;

		if (this.started == false) {
			this.start();
		}
		players.forEach((player) => {
			if (player.hitBall(this)) {
				this.paddleBounce(player.paddle);
				this.lastHit = player;
			}
		});
		if (effect && effect.isOn() && effect.hitBall(this) && this.lastHit) {
			if (!this.lastHit.spellBook.spellEnabled(effect.type)) {
				this.lastHit.spellBook.enableSpell(effect.type);
				effect.setOff();
			}
		}
		if (this.position.y + this.scale.y * params.BALL_RADIUS >= field.borders.top || this.position.y - this.scale.y * params.BALL_RADIUS <= field.borders.bottom)
			this.vecSpeed.y *= -1;
		if (this.position.x >= field.borders.right || this.position.x <= field.borders.left) {
			if (this.position.x >= field.borders.right)
				players[1].scored();
			else
				players[0].scored();
			this.reset();
		}
	}

	paddleBounce(paddle: Paddle) {
		const normIntersect = this.position.y - paddle.position.y;
		const bouceAngle = normIntersect * params.MAX_BOUNCE_ANGLE;

		this.speed += 0.001;
		this.vecSpeed.x = -this.speed * Math.cos(bouceAngle);
		this.vecSpeed.y = this.speed * Math.sin(bouceAngle);
		if (this.position.x < 0) {
			this.vecSpeed.x *= -1;
			this.position.x = paddle.position.x + params.BALL_RADIUS + paddle.width / 2 + 0.001;
		}
		else {
			this.position.x = paddle.position.x - params.BALL_RADIUS - paddle.width / 2 - 0.001;
		}
		if (this.effect != "none") {
			this.transmitEffect(paddle);
			this.resetEffect();
		}
		else
			paddle.resetEffect();
	}


	transmitEffect(paddle: Paddle) {
		paddle.effect = this.effect;
		switch (this.effect) {
			case "ice":
				paddle.speed *= 0.5;
				break;
			case "fire":
				paddle.speed *= 2;
				break;
			case "small":
				paddle.scale.y *= 0.5;
				paddle.height *= paddle.scale.y;
				break;
			default: break;
		}
	}

	resetEffect() {
		this.scale = {x: 1, y: 1, z: 1};
		this.radius = params.BALL_RADIUS;
		this.effect = "none";
	}

	getEffect(): string {
		return this.effect;
	}

	reset() {
		this.resetEffect();
		this.lastHit = null;
		this.position = {x: 0, y: 0, z: 0};
		this.speed = params.BALL_SPEED;
		this.vecSpeed = {x: 0, y: 0, z: 0};
		this.start();
	}
};

export { Ball };