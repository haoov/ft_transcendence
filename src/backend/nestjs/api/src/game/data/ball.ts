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
	effect: Effect;
	lastHit: Paddle;

	constructor() {
		this.position = {x: 0, y: 0, z: 0};
		this.speed = params.BALL_SPEED;
		this.vecSpeed = {x: this.speed, y: 0, z: 0};
		this.effect = new Effect("none");
		this.radius = params.BALL_RADIUS;
		this.scale = {x: 1, y: 1, z: 1};
	}

	start() {
		const direction: number = (Math.random() > 0.5 ? 1 : -1);
		this.vecSpeed.x = params.BALL_SPEED * direction;
	}

	moove(players: Player[], field: Field, effect?: Effect) {
		this.position.x += this.vecSpeed.x;
		this.position.y += this.vecSpeed.y;

		for (let i = 0; i < players.length; ++i) {
			if (players[i].hitBall(this)) {
				this.paddleBounce(players[i].paddle);
				this.lastHit = players[i].paddle;
			}
		}
		if (effect && effect.on && effect.hitBall(this)) {
				effect.apply(this, this.lastHit);
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

		this.speed += 0.002;
		this.vecSpeed.x = -this.speed * Math.cos(bouceAngle);
		this.vecSpeed.y = this.speed * Math.sin(bouceAngle);
		if (this.position.x < 0) {
			this.vecSpeed.x *= -1;
			this.position.x = paddle.position.x + params.BALL_RADIUS + paddle.width / 2 + 0.001;
		}
		else {
			this.position.x = paddle.position.x - params.BALL_RADIUS - paddle.width / 2 - 0.001;
		}
		if (this.effect.type != "none") {
			this.effect.transmit(paddle);
			this.resetEffect();
		}
		else
			paddle.resetEffect();
	}

	resetEffect() {
		this.scale = {x: 1, y: 1, z: 1};
		this.radius = params.BALL_RADIUS;
		this.effect.type = "none";
	}

	reset() {
		this.resetEffect();
		this.position = {x: 0, y: 0, z: 0};
		this.speed = params.BALL_SPEED;
		this.vecSpeed = {x: 0, y: 0, z: 0};
		setTimeout(() => {
			const direction: number = (Math.random() > 0.5 ? 1 : -1);
			this.vecSpeed.x = params.BALL_SPEED * direction;
		}, 1000);
	}
};

export { Ball };