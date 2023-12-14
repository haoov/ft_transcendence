import { Effect } from "./effect";
import { Field } from "./field";
import { Vec3, params } from "./opts"
import { Paddle } from "./paddle";
import { Player } from "./player";

class Ball {
	speed: number;
	position: Vec3;
	vecSpeed: Vec3;
	Scale: Vec3;
	effect: string;

	constructor() {
		this.position = {x: 0, y: 0, z: 0};
		this.speed = params.BALL_SPEED;
		this.vecSpeed = {x: this.speed, y: 0, z: 0};
		this.effect = "none";
	}

	moove(players: Player[], field: Field, effects: Effect[]) {
		this.position.x += this.vecSpeed.x;
		this.position.y += this.vecSpeed.y;
		for (let i = 0; i < players.length; ++i) {
			if (players[i].hitBall(this))
				this.paddleBounce(players[i].paddle);
		}
		for (let i = 0; i < effects.length; ++i) {
			if (effects[i].hitBall(this))
				this.effect = effects[i].type;
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
		if (this.effect != "none") {
			paddle.effect = this.effect;
			this.effect = "none";
		}
		else
			paddle.effect = "none";
	}

	reset() {
		this.position = {x: 0, y: 0, z: 0};
		this.speed = params.BALL_SPEED;
		this.vecSpeed = {x: this.speed, y: 0, z: 0};
	}
};

export { Ball };