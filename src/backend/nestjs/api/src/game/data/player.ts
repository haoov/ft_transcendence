import { ConsoleLogger } from "@nestjs/common";
import { Ball } from "./ball";
import { Field } from "./field";
import { Paddle } from "./paddle";

class Player {
	side: string;
	paddle: Paddle;

	constructor(side: string, field: Field) {
		this.side = side;
		this.paddle = new Paddle(this.side, field);
	}

	hitBall(ball: Ball): boolean {
		const ballX = ball.position.x;
		const ballY = ball.position.y;
		const paddleX = this.paddle.position.x;
		const paddleY = this.paddle.position.y;
		var aligned = false;

		if (ballY >= paddleY - this.paddle.height / 2 && ballY <= paddleY + this.paddle.height / 2) {
			aligned = true;
		}
		if (aligned && this.side == "right" && ballX >= paddleX - this.paddle.width)
				return true;
		if (aligned && this.side == "left" && ballX <= paddleX + this.paddle.width)
				return true;
		return false;
	}
}

export { Player }; 