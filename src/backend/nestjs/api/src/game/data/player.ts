import { ConsoleLogger } from "@nestjs/common";
import { Ball } from "./ball";
import { Field } from "./field";
import { Paddle } from "./paddle";
import { User } from "src/user/user.interface";

class Player {
	socketId: string;
	playerId: number;
	user: User;
	paddle: Paddle;

	constructor(user: User, socketId: string, playerId: number, field: Field) {
		this.user = user;
		this.socketId = socketId;
		this.playerId = playerId;
		this.paddle = (this.playerId == 1 ? new Paddle("right", field) : new Paddle("left", field));
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
		if (aligned && this.playerId == 1 && ballX >= paddleX - this.paddle.width)
				return true;
		if (aligned && this.playerId == 2 && ballX <= paddleX + this.paddle.width)
				return true;
		return false;
	}
}

export { Player }; 