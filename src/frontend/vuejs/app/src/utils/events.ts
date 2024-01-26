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
	gameInvite = "gameInvite",
	gameResponse = "gameResponse",
	checkGame = "checkGame",
	addFriend = "addFriend",
	friendResponse = "friendResponse",
	pong = "pong",
};
export enum ServerEvents {
	started = "started",
	updated = "updated",
	finished = "finished",
	disconnect = "disconnect",
	waiting = "waiting",
	playing = "playing",
	gameReady = "gameReady",
	waitingForOpponent = "waitingForOpponent",
	disableNotifications = "disableNotifications",
	updateStatus = "updateStatus",
	gameInvite = "gameInvite",
	dataChanged = "dataChanged",
	gameResponse = "gameResponse",
	addFriend = "addFriend",
	friendResponse = "friendResponse",
	ping = "ping",
};