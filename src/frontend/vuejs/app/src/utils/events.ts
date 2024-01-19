export enum ClientEvents {
	connected = "connected",
	gameParams = "gameParams",
	update = "update",
	mode = "mode",
	move = "move",
	useSpell = "useSpell",
	stopWaiting = "stopWaiting",
	leave = "leave",
	gamePlay = "gamePlay",
	gameForfeit = "gameForfeit",
};
export enum ServerEvents {
	position = "position",
	started = "started",
	updated = "updated",
	finished = "finished",
	disconnect = "disconnect",
	waiting = "waiting",
	playing = "playing",
	gameReady = "gameReady",
	waitingForOpponent = "waitingForOpponent",
	disableNotifications = "disableNotifications",
};