import { PositionInterface } from "../interfaces"

export class Position {
	public p1:{
		x: number;
		y: number;
	};
	public p2: {
		x: number;
		y: number;
	}

	constructor() { // default values
        this.p1 = { x: 100, y: 200 };
        this.p2 = { x: 500, y: 200 };
	};

	public getPosition(): PositionInterface {
		return {
			p1: {
				x: this.p1.x,
				y: this.p1.y,
			},
			p2: {
				x: this.p2.x,
				y: this.p2.y,
			}
		};
	}
}