"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const paddle_1 = require("./paddle");
const opts_1 = require("./opts");
class Player {
    constructor(side, field) {
        this.side = side;
        this.paddle = new paddle_1.Paddle(this.side, field);
        this.score = 0;
    }
    hitBall(ball) {
        const ballX = ball.position.x;
        const ballY = ball.position.y;
        const paddleX = this.paddle.position.x;
        const paddleY = this.paddle.position.y;
        let aligned = false;
        if (ballY >= paddleY - (this.paddle.height / 2) - ball.radius
            && ballY <= paddleY + (this.paddle.height / 2) + ball.radius) {
            aligned = true;
        }
        if (aligned && this.side == "right"
            && ballX + ball.radius >= paddleX - this.paddle.width / 2
            && ballX <= paddleX)
            return true;
        if (aligned && this.side == "left"
            && ballX - ball.radius <= paddleX + this.paddle.width / 2
            && ballX >= paddleX)
            return true;
        return false;
    }
    scored() {
        ++this.score;
    }
    topScore() {
        this.score = opts_1.rules.WIN_SCORE;
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map