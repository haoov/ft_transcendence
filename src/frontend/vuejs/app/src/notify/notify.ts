import { reactive } from "vue";
import type { Notification, NotificationParams, NotificationType } from "./interfaces";

const notifications: Notification[] = reactive<Notification[]>([]);

let idCounter = 1;

function removeNotification(id: string): void {
	const index = notifications.findIndex((notification) => notification.id == id);
	if (index != -1) {
		notifications.splice(index, 1);
	}
}

function newNotification(type: NotificationType, params?: NotificationParams): void {
	const notification: Notification = {
		id: idCounter.toString(),
		message: "",
		type: ""
	};
	switch (type) {
		case "gameInvite":
			notification.message = params?.message || "game invite";
			notification.type = "gameInvite";
			notification.by = params?.by;
			break;
		case "gameReady":
			notification.message = params?.message || "ready to play!";
			notification.type = "gameReady";
			notification.by = params?.by;
			notification.autoClose = params?.autoClose || true;
			notification.timeout = params?.timeout || 10000;
			break;
		default: break;
	}
	notifications.splice(0, 0, notification);
	if (notification.autoClose) {
		setTimeout(() => {
			removeNotification(notification.id);
		}, notification.timeout);
	}
	++idCounter;
}

function getNotifications(): Notification[] {
	return notifications.slice(0, 5);
}

export default {
	newNotification,
	getNotifications,
	removeNotification,
}