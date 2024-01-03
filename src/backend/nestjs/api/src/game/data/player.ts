import { ConsoleLogger } from "@nestjs/common";
import { Ball } from "./ball";
import { Field } from "./field";
import { Paddle } from "./paddle";
import { rules } from "./opts";

class Player {
	side: string;
	paddle: Paddle;
	score: number;

	constructor(side: string, field: Field) {
		this.side = side;
		this.paddle = new Paddle(this.side, field);
		this.score = 0;
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

	scored() {
		++this.score;
	}

	topScore() {
		this.score = rules.WIN_SCORE;
	}
}

export { Player }; 