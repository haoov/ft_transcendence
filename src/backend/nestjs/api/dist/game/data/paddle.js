"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paddle = void 0;
const effect_1 = require("./effect");
const opts_1 = require("./opts");
class Paddle {
    constructor(side, field) {
        this.side = side;
        this.speed = opts_1.params.PADDLE_SPEED;
        this.width = opts_1.params.PADDLE_WIDTH;
        this.height = opts_1.params.PADDLE_HEIGHT;
        if (this.side == "right")
            this.startPosition = { x: field.borders.right - this.width, y: 0, z: 0 };
        else
            this.startPosition = { x: field.borders.left + this.width, y: 0, z: 0 };
        this.position = { x: this.startPosition.x, y: this.startPosition.y, z: this.startPosition.z };
        this.scale = { x: 1, y: 1, z: 1 };
        this.effect = new effect_1.Effect("none");
    }
    move(direction, field) {
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
    autoMove(ball, field, difficulty) {
        let reactivityFactor;
        let placementFactor = 1;
        if (difficulty == "easy")
            reactivityFactor = 0.04;
        else if (difficulty == "medium")
            reactivityFactor = 0.06;
        else
            reactivityFactor = 0.08;
        const distance = ball.position.y - this.position.y;
        if (distance > 0)
            this.position.y += Math.min(distance, this.speed * reactivityFactor);
        else if (distance < 0)
            this.position.y -= Math.max(distance, this.speed * reactivityFactor);
    }
    resetEffect() {
        this.scale.y = 1;
        this.speed = opts_1.params.PADDLE_SPEED;
        this.height = opts_1.params.PADDLE_HEIGHT;
        this.effect.type = "none";
    }
    reset() {
        this.position = { x: this.startPosition.x, y: this.startPosition.y, z: this.startPosition.z };
        this.speed = opts_1.params.PADDLE_SPEED;
    }
}
exports.Paddle = Paddle;
;
//# sourceMappingURL=paddle.js.map