export enum clientEvents {
	connected = "connected",
	update = "update",
	mode = "mode",
	stopWaiting = "stopWaiting",
	gameParams = "gameParams",
	move = "move",
	useSpell = "useSpell",
	leave = "leave",
	gamePlay = "gamePlay",
	gameForfeit = "gameForfeit",
};

export enum serverEvents {
	updated = "updated",
	ready = "ready",
	started = "started",
	finished = "finished",
	waiting = "waiting",
	waitingForOpponent = "waitingForOpponent",
	playing = "playing",
	gameReady = "gameReady",
	gameInvite = "gameInvite",
	disableNotifications = "disableNotifications",
};