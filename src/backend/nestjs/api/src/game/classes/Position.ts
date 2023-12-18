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
	public score_p1: number;
	public score_p2: number;

	constructor() { // default values
        this.p1 = { x: 100, y: 200 };
        this.p2 = { x: 500, y: 200 };
		this.score_p1 = 0;
		this.score_p2 = 0;
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

	public isFinished(): boolean {
		if (this.score_p1 >= 10 || this.score_p2 >= 10)
			return true;
		return false;
	}
}