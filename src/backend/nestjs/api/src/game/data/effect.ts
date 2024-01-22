import { Ball } from "./ball";
import { Field } from "./field";
import { Vec3 } from "./opts";
import { Paddle } from "./paddle";

class Effect {
	types: string[];
	type: string;
	position: Vec3;
	rotationSpeed: number;
	speed: number;
	size: number;
	private on: boolean;

	constructor(type?: string) {
		this.position = {x: 0, y: 0, z: 0};
		this.rotationSpeed = 0.005;
		this.size = 0.2;
		this.speed = 0.003;
		this.on = false;
		this.types = ["ice", "fire", "big", "small"];
		this.type = (type ? type : this.types[Math.floor(Math.random() * this.types.length)]);
	}

	moove(field: Field) {
		this.position.y += this.speed;
		if (	this.position.y >= field.borders.top - this.size
					|| this.position.y <= field.borders.bottom + this.size)
			this.speed *= -1;
		if (this.on == false) {
			if (Math.random() > 0.999) {
				this.type = this.types[Math.floor(Math.random() * this.types.length)];
				this.on = true;
			}
		}
	}

	hitBall(ball: Ball): boolean {
		const ballX = ball.position.x;
		const ballY = ball.position.y
		var aligned = false;
		
		if (ballY >= this.position.y - this.size && ballY <= this.position.y + this.size) {
			aligned = true;
		}
		if (aligned && ballX >= this.position.x - this.size && ballX <= this.position.x + this.size)
			return true;
		return false;
	}

	isOn(): boolean {
		return this.on;
	}

	setOn() {
		this.on = true;
	}

	setOff() {
		this.on = false;
	}
}

export { Effect };