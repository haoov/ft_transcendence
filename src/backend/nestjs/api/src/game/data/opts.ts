interface Vec3 {
	x: number,
	y: number,
	z: number,
}

const window = {
	WIDTH: 720,
	HEIGHT: 480,
}

const params = {
	PADDLE_SPEED: 0.2,
	PADDLE_WIDTH: 0.1,
	PADDLE_HEIGHT: 0.5,
	PADDLE_DEPTH: 0.1,
	BALL_SPEED: 0.02,
	BALL_RADIUS: 0.08,
	MAX_BOUNCE_ANGLE: Math.PI,
}

const cam = {
	FOV: 10,
	ASPECT: 720/480,
	NEARZ: 0.1,
	FARZ: 1000,
	ZPOS: 20,
}

const colors = {
	WHITE: 0xffffff,
};

const rules = {
	WIN_SCORE: 3,
}

class Utils {
	visibleHeight(depth: number) {
		const cameraOffset = cam.ZPOS;
		if (depth < cameraOffset)
			depth += cameraOffset;
		else
			depth -= cameraOffset;
		const vFOV = cam.FOV * Math.PI / 180;
		return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
	}

	visibleWidth(depth: number) {
		const height = this.visibleHeight(depth);
		return height * cam.ASPECT;
	}
}

const utils = new Utils;

export { Vec3 };
export { colors };
export { params };
export { window };
export { utils } ;
export { cam };
export { rules };