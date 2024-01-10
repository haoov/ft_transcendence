import { Ball } from "./ball";
import { Field } from "./field";
import { Vec3 } from "./opts";
import { Paddle } from "./paddle";
declare class Effect {
    types: string[];
    type: string;
    position: Vec3;
    rotationSpeed: number;
    speed: number;
    size: number;
    on: boolean;
    constructor(type?: string);
    moove(field: Field): void;
    hitBall(ball: Ball): boolean;
    apply(ball: Ball, paddle: Paddle): void;
    transmit(paddle: Paddle): void;
}
export { Effect };
