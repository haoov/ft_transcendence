"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Effect = void 0;
class Effect {
    constructor(type) {
        this.position = { x: 0, y: 0, z: 0 };
        this.rotationSpeed = 0.005;
        this.size = 0.2;
        this.speed = 0.005;
        this.on = false;
        this.types = ["ice", "fire", "big", "small"];
        this.type = (type ? type : this.types[Math.floor(Math.random() * this.types.length)]);
    }
    moove(field) {
        this.position.y += this.speed;
        if (this.position.y >= field.borders.top - this.size
            || this.position.y <= field.borders.bottom + this.size)
            this.speed *= -1;
        if (this.on == false) {
            if (Math.random() > 0.99) {
                this.type = this.types[Math.floor(Math.random() * this.types.length)];
                this.on = true;
            }
        }
    }
    hitBall(ball) {
        const ballX = ball.position.x;
        const ballY = ball.position.y;
        var aligned = false;
        if (ballY >= this.position.y - this.size && ballY <= this.position.y + this.size) {
            aligned = true;
        }
        if (aligned && ballX >= this.position.x - this.size && ballX <= this.position.x + this.size)
            return true;
        return false;
    }
    apply(ball, paddle) {
        switch (this.type) {
            case "ice":
                ball.effect.type = this.type;
                ball.vecSpeed.x *= 0.8;
                ball.vecSpeed.y *= 0.8;
                break;
            case "fire":
                ball.effect.type = this.type;
                ball.vecSpeed.x *= 1.5;
                ball.vecSpeed.y *= 1.5;
                break;
            case "big":
                paddle.effect.type = this.type;
                paddle.scale.y *= 2;
                paddle.height *= paddle.scale.y;
                break;
            case "small":
                ball.effect.type = this.type;
                ball.scale = { x: 0.5, y: 0.5, z: 0.5 };
                ball.radius *= ball.scale.x;
                break;
            default: break;
        }
        this.on = false;
    }
    transmit(paddle) {
        paddle.effect.type = this.type;
        switch (this.type) {
            case "ice":
                paddle.speed *= 0.5;
                break;
            case "fire":
                paddle.speed *= 2;
                break;
            case "small":
                paddle.scale.y *= 0.5;
                paddle.height *= paddle.scale.y;
                break;
            default: break;
        }
    }
}
exports.Effect = Effect;
//# sourceMappingURL=effect.js.map