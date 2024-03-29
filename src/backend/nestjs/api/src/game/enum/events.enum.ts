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
	gameInvite = "gameInvite",
	gameResponse = "gameResponse",
	checkGame = "checkGame",
	addFriend = "addFriend",
	friendResponse = "friendResponse",
	pong = "pong",
};

export enum serverEvents {
	updated = "updated",
	ready = "ready",
	started = "started",
	finished = "finished",
	gameReady = "gameReady",
	gameInvite = "gameInvite",
	disableNotifications = "disableNotifications",
	updateStatus = "updateStatus",
	dataChanged = "dataChanged",
	gameResponse = "gameResponse",
	addFriend = "addFriend",
	friendResponse = "friendResponse",
	ping = "ping",
};