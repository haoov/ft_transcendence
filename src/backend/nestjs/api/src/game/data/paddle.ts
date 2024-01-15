import { Ball } from "./ball";
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
	effect: string;

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
		this.effect = "none";
	}

	move(direction: string, field: Field) {
		if (direction == "up") {
			if (this.position.y + this.speed <= field.borders.top - this.height / 2)
				this.position.y += this.speed;
			else
				this.position.y = field.borders.top - this.height / 2;
		}
		if (direction == "down")
			if (this.position.y - this.speed >= field.borders.bottom + this.height / 2)
				this.position.y -= this.speed;
			else
				this.position.y = field.borders.bottom + this.height / 2;
	}

	autoMove(ball: Ball, field: Field, difficulty: string) {
		let reactivityFactor: number;
		let placementFactor: number = 1;

		if (difficulty == "easy")
			reactivityFactor = 0.04;
		else if (difficulty == "medium")
			reactivityFactor = 0.06;
		else
			reactivityFactor = 0.08;

		// Calculate the distance between the ball and the paddle
		const distance = ball.position.y - this.position.y;

		// Move the paddle proportionally to the distance
		if (distance > 0) {
				const nextPosition = this.position.y + Math.min(distance, this.speed * reactivityFactor);
				if (nextPosition > field.borders.top - this.height / 2)
					this.position.y = field.borders.top - this.height / 2;
				else
					this.position.y = nextPosition;
		}
		else if (distance < 0) {
				const nextPosition = this.position.y - Math.max(distance, this.speed * reactivityFactor);
				if (nextPosition < field.borders.bottom + this.height / 2)
					this.position.y = field.borders.bottom + this.height / 2;
				else
					this.position.y = nextPosition;
		}
	}

	resetEffect() {
		this.scale.y = 1;
		this.speed = params.PADDLE_SPEED;
		this.height = params.PADDLE_HEIGHT;
		this.effect = "none";
	}

	reset() {
		this.position = {x: this.startPosition.x, y: this.startPosition.y, z: this.startPosition.z};
		this.speed = params.PADDLE_SPEED;
	}
};

export { Paddle };