interface Vec3 {
    x: number;
    y: number;
    z: number;
}
declare const window: {
    WIDTH: number;
    HEIGHT: number;
};
declare const params: {
    PADDLE_SPEED: number;
    PADDLE_WIDTH: number;
    PADDLE_HEIGHT: number;
    PADDLE_DEPTH: number;
    BALL_SPEED: number;
    BALL_RADIUS: number;
    MAX_BOUNCE_ANGLE: number;
};
declare const cam: {
    FOV: number;
    ASPECT: number;
    NEARZ: number;
    FARZ: number;
    ZPOS: number;
};
declare const colors: {
    WHITE: number;
};
declare const rules: {
    WIN_SCORE: number;
};
declare class Utils {
    visibleHeight(depth: number): number;
    visibleWidth(depth: number): number;
}
declare const utils: Utils;
export { Vec3 };
export { colors };
export { params };
export { window };
export { utils };
export { cam };
export { rules };
