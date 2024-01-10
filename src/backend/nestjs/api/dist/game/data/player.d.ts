import { Ball } from "./ball";
import { Field } from "./field";
import { Paddle } from "./paddle";
declare class Player {
    side: string;
    paddle: Paddle;
    score: number;
    constructor(side: string, field: Field);
    hitBall(ball: Ball): boolean;
    scored(): void;
    topScore(): void;
}
export { Player };
