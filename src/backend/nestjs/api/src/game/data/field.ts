import { Vec3, params, utils } from "./opts";

class Field {
	width: number;
	height: number;
	position: Vec3;
	borders: {top: number, bottom: number, right: number, left: number};

	constructor() {
		this.position = {x: 0, y: 0, z: 1};
		this.width = utils.visibleWidth(this.position.z);
		this.height = utils.visibleHeight(this.position.z);
		this.borders = {
			top: utils.visibleHeight(0) / 2,
			bottom: -utils.visibleHeight(0) / 2,
			right: utils.visibleWidth(0) / 2,
			left: -utils.visibleWidth(0) / 2,
		};
	}
}

export { Field };