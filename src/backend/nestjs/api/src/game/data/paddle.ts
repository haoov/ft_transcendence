import { Effect } from "./effect";
import { Field } from "./field";
import { Vec3, params } from "./opts";

class Paddle {
	side: string;
	width: number;
	height: number;
	depth: number;
	startPosition: Vec3;
	position: Vec3;
	scale: Vec3;
	speed: number;
	effect: Effect;

	constructor(side: string, field: Field) {
		this.side = side;
		this.speed = params.PADDLE_SPEED;
		this.width = params.PADDLE_WIDTH;
		this.height = params.PADDLE_HEIGHT;
		if (this.side == "right")
			this.startPosition = {x: field.borders.right - this.width, y : 0, z : 0};
		else
			this.startPosition = {x: field.borders.left + this.width, y: 0, z: 0};
		this.position = {x: this.startPosition.x, y: this.startPosition.y, z: this.startPosition.z};
		this.scale = {x: 1, y: 1, z: 1};
		this.effect = new Effect("none");
	}

	resetEffect() {
		this.scale.y = 1;
		this.speed = params.PADDLE_SPEED;
		this.height = params.PADDLE_HEIGHT;
		this.effect.type = "none";
	}

	reset() {
		this.position = {x: this.startPosition.x, y: this.startPosition.y, z: this.startPosition.z};
		this.speed = params.PADDLE_SPEED;
	}
};

export { Paddle };