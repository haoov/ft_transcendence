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
	effect: Effect;
	lastHit: Paddle;

	constructor() {
		this.position = {x: 0, y: 0, z: 0};
		this.speed = params.BALL_SPEED;
		this.vecSpeed = {x: this.speed, y: 0, z: 0};
		this.effect = new Effect("none");
		this.scale = {x: 1, y: 1, z: 1};
	}

	start() {
		const direction: number = (Math.random() > 0.5 ? 1 : -1);
		this.vecSpeed.x = params.BALL_SPEED * direction;
	}

	moove(players: Player[], field: Field, effect: Effect) {
		this.position.x += this.vecSpeed.x;
		this.position.y += this.vecSpeed.y;

		for (let i = 0; i < players.length; ++i) {
			if (players[i].hitBall(this)) {
				this.paddleBounce(players[i].paddle);
				this.lastHit = players[i].paddle;
			}
		}
		if (effect.on == true && effect.hitBall(this)) {
			effect.apply(this, this.lastHit);
		}
		if (this.position.y >= field.borders.top || this.position.y <= field.borders.bottom)
			this.vecSpeed.y *= -1;
		if (this.position.x >= field.borders.right || this.position.x <= field.borders.left)
			this.reset();
	}

	paddleBounce(paddle: Paddle) {
		const normIntersect = this.position.y - paddle.position.y;
		const bouceAngle = normIntersect * params.MAX_BOUNCE_ANGLE;

		this.vecSpeed.x = -this.speed * Math.cos(bouceAngle);
		this.vecSpeed.y = this.speed * Math.sin(bouceAngle);
		if (this.position.x < 0)
			this.vecSpeed.x *= -1;
		if (this.effect.type != "none") {
			this.effect.transmit(paddle);
			this.resetEffect();
		}
		else
			paddle.resetEffect();
	}

	resetEffect() {
		this.scale = {x: 1, y: 1, z: 1};
		this.effect.type = "none";
	}

	reset() {
		this.resetEffect();
		this.position = {x: 0, y: 0, z: 0};
		this.speed = params.BALL_SPEED;
		this.vecSpeed = {x: 0, y: 0, z: 0};
		setTimeout(this.start, 1000);
	}
};

export { Ball };