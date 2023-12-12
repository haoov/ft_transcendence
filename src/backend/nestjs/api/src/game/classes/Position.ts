import { PositionInterface } from "../interfaces"

export class Position {
	private _p1:{
		x: number;
		y: number;
	};
	private _p2: {
		x: number;
		y: number;
	}

	constructor() { // default values
		this._p1.x = 100;
		this._p2.x = 500;
		this._p1.y = 200;
		this._p2.y = 200;
	};

	public getPosition(): PositionInterface {
		return {
			p1: {
				x: this._p1.x,
				y: this._p1.y,
			},
			p2: {
				x: this._p2.x,
				y: this._p2.y,
			}
		};
	}
}