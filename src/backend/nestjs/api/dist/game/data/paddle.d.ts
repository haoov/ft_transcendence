import { Ball } from "./ball";
import { Effect } from "./effect";
import { Field } from "./field";
import { Vec3 } from "./opts";
declare class Paddle {
    side: string;
    width: number;
    height: number;
    depth: number;
    startPosition: Vec3;
    position: Vec3;
    scale: Vec3;
    speed: number;
    effect: Effect;
    constructor(side: string, field: Field);
    move(direction: string, field: Field): void;
    autoMove(ball: Ball, field: Field, difficulty: string): void;
    resetEffect(): void;
    reset(): void;
}
export { Paddle };
