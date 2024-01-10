import { Effect } from "./effect";
import { Field } from "./field";
import { Vec3 } from "./opts";
import { Paddle } from "./paddle";
import { Player } from "./player";
declare class Ball {
    speed: number;
    position: Vec3;
    vecSpeed: Vec3;
    scale: Vec3;
    radius: number;
    effect: Effect;
    lastHit: Paddle;
    constructor();
    start(): void;
    moove(players: Player[], field: Field, effect?: Effect): void;
    paddleBounce(paddle: Paddle): void;
    resetEffect(): void;
    reset(): void;
}
export { Ball };
