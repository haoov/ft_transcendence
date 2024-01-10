"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = exports.cam = exports.utils = exports.window = exports.params = exports.colors = void 0;
const window = {
    WIDTH: 720,
    HEIGHT: 480,
};
exports.window = window;
const params = {
    PADDLE_SPEED: 0.2,
    PADDLE_WIDTH: 0.1,
    PADDLE_HEIGHT: 0.5,
    PADDLE_DEPTH: 0.1,
    BALL_SPEED: 0.02,
    BALL_RADIUS: 0.08,
    MAX_BOUNCE_ANGLE: Math.PI / 2,
};
exports.params = params;
const cam = {
    FOV: 10,
    ASPECT: 720 / 480,
    NEARZ: 0.1,
    FARZ: 1000,
    ZPOS: 20,
};
exports.cam = cam;
const colors = {
    WHITE: 0xffffff,
};
exports.colors = colors;
const rules = {
    WIN_SCORE: 3,
};
exports.rules = rules;
class Utils {
    visibleHeight(depth) {
        const cameraOffset = cam.ZPOS;
        if (depth < cameraOffset)
            depth += cameraOffset;
        else
            depth -= cameraOffset;
        const vFOV = cam.FOV * Math.PI / 180;
        return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
    }
    visibleWidth(depth) {
        const height = this.visibleHeight(depth);
        return height * cam.ASPECT;
    }
}
const utils = new Utils;
exports.utils = utils;
//# sourceMappingURL=opts.js.map