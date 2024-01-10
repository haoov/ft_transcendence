"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pong = void 0;
const ball_1 = require("./ball");
const effect_1 = require("./effect");
const field_1 = require("./field");
const opts_1 = require("./opts");
const player_1 = require("./player");
class Pong {
    constructor(params) {
        this.game = params.game;
        this.mode = params.mode;
        this.difficulty = params.difficulty;
        this.players = [];
        this.field = new field_1.Field();
        this.players.push(new player_1.Player("right", this.field));
        this.players.push(new player_1.Player("left", this.field));
        this.ball = new ball_1.Ball();
        this.effect = new effect_1.Effect();
        this.started = false;
        this.finished = false;
    }
    movePaddle(side, direction) {
        const player = this.players.find((currentPlayer) => { return (currentPlayer.side == side); });
        if (direction == "up")
            player.paddle.move(direction, this.field);
        if (direction == "down")
            player.paddle.move(direction, this.field);
    }
    initParams() {
        return {
            window: opts_1.window,
            cam: opts_1.cam,
            params: {
                FIELD_WIDTH: this.field.width,
                FIELD_HEIGHT: this.field.height,
                PADDLE_WIDTH: opts_1.params.PADDLE_WIDTH,
                PADDLE_HEIGHT: opts_1.params.PADDLE_HEIGHT,
                PADDLE_DEPTH: opts_1.params.PADDLE_DEPTH,
                BALL_RADIUS: opts_1.params.BALL_RADIUS,
            },
            colors: opts_1.colors
        };
    }
    start() {
        this.started = true;
    }
    update() {
        if (this.started) {
            if (this.game == "super") {
                this.ball.moove(this.players, this.field, this.effect);
                this.effect.moove(this.field);
            }
            else
                this.ball.moove(this.players, this.field);
            if (this.mode == "singlePlayer")
                this.players[1].paddle.autoMove(this.ball, this.field, this.difficulty);
            for (let i = 0; i < this.players.length; ++i) {
                if (this.players[i].score == opts_1.rules.WIN_SCORE)
                    this.finished = true;
            }
        }
        return {
            ballPosition: this.ball.position,
            ballScale: this.ball.scale,
            ballEffect: (this.ball.effect != null ? this.ball.effect.type : "none"),
            p1PaddlePosition: this.players[0]?.paddle.position,
            p1PaddleScale: this.players[0]?.paddle.scale,
            p1Effect: (this.players[0]?.paddle.effect != null ? this.players[0]?.paddle.effect.type : "none"),
            p2PaddlePosition: this.players[1]?.paddle.position,
            p2PaddleScale: this.players[1]?.paddle.scale,
            p2Effect: (this.players[1]?.paddle.effect != null ? this.players[1]?.paddle.effect.type : "none"),
            effectPosition: this.effect.position,
            effectRotationSpeed: this.effect.rotationSpeed,
            effectOn: this.effect.on,
            p1Score: this.players[0].score,
            p2Score: this.players[1].score,
            finished: this.finished,
        };
    }
    reset() {
        this.ball.reset();
        for (let i = 0; i < this.players.length; ++i)
            this.players[i].paddle.reset();
    }
    getPlayers() {
        return this.players;
    }
    getMode() {
        return this.mode;
    }
}
exports.Pong = Pong;
;
//# sourceMappingURL=Pong.js.map