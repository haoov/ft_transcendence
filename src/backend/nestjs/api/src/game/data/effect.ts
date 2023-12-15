import { Ball } from "./ball";
import { Vec3 } from "./opts";

class Effect {
	type: string;
	position: Vec3;
	rotationSpeed: number;
	size: number;

	constructor(type: string) {
		this.position = {x: 0, y: 0, z: 0};
		this.rotationSpeed = 0.01;
		this.size = 0.2;
	}

	hitBall(ball: Ball): boolean {
		const ballX = ball.position.x;
		const ballY = ball.position.y
		var aligned = false;
		
		if (ballY >= this.position.y - this.size && ballY <= this.position.y + this.size)
			aligned = true;
		if (aligned && ballX >= -this.position.x && ballX <= this.position.x)
			return true;
		return false;
	}
}

export { Effect };