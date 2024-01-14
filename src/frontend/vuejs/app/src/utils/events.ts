export enum ClientEvents {
	connected = "connected",
	mode = "mode",
	up = "up",
	down = "down",
	left = "left",
	right = "right",
	stopWaiting = "stopWaiting",
	leave = "leave",
	gamePlay = "gamePlay",
	gameForfeit = "gameForfeit",
};
export enum ServerEvents {
	position = "position",
	finished = "finished",
	disconnect = "disconnect",
	waiting = "waiting",
	playing = "playing",
	gameReady = "gameReady",
	waitingForOpponent = "waitingForOpponent",
	disableNotifications = "disableNotifications",
};