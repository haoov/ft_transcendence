import { reactive } from "vue";

export interface position {
	p1: {
		x: number;
		y: number;
	},
	p2: {
		x: number;
		y: number;
	}
};

export const game :position = reactive({
	p1: {
		x: 0,
		y: 0,
	},
	p2: {
		x: 0,
		y: 0,
	},
});