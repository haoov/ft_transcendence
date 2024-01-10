export enum clientEvents {
	connected = "connected",
	update = "update",
	mode = "mode",
	stopWaiting = "stopWaiting",
	gameParams = "gameParams",
	move = "move",
};

export enum serverEvents {
	updated = "updated",
	ready = "ready",
	started = "started",
	finished = "finished",
	waiting = "waiting",
	playing = "playing",
};