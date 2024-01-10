import { gameParams } from "../interfaces/gameParams";
import { Player } from "./player";
declare class Pong {
    private players;
    private ball;
    private field;
    private effect;
    private started;
    private finished;
    private game;
    private mode;
    private difficulty;
    constructor(params: gameParams);
    movePaddle(side: string, direction: string): void;
    initParams(): {
        window: {
            WIDTH: number;
            HEIGHT: number;
        };
        cam: {
            FOV: number;
            ASPECT: number;
            NEARZ: number;
            FARZ: number;
            ZPOS: number;
        };
        params: {
            FIELD_WIDTH: number;
            FIELD_HEIGHT: number;
            PADDLE_WIDTH: number;
            PADDLE_HEIGHT: number;
            PADDLE_DEPTH: number;
            BALL_RADIUS: number;
        };
        colors: {
            WHITE: number;
        };
    };
    start(): void;
    update(): {
        ballPosition: import("./opts").Vec3;
        ballScale: import("./opts").Vec3;
        ballEffect: string;
        p1PaddlePosition: import("./opts").Vec3;
        p1PaddleScale: import("./opts").Vec3;
        p1Effect: string;
        p2PaddlePosition: import("./opts").Vec3;
        p2PaddleScale: import("./opts").Vec3;
        p2Effect: string;
        effectPosition: import("./opts").Vec3;
        effectRotationSpeed: number;
        effectOn: boolean;
        p1Score: number;
        p2Score: number;
        finished: boolean;
    };
    reset(): void;
    getPlayers(): Player[];
    getMode(): string;
}
export { Pong };
