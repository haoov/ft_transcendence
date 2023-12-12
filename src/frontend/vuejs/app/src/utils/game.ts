import { reactive } from "vue";

interface position {
	x: number;
	y: number;
}

const game = reactive({
	myPosition: {
		x: 0,
		y: 0,
	} as position,

	oppPosition: {
		x: 0,
		y: 0,
	} as position,

})

export default {
	game,
}