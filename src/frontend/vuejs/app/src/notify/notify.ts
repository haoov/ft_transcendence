import { reactive } from "vue";
import type { Notification, NotificationParams } from "./interfaces"

const notifications: Notification[] = reactive<Notification[]>([]);

let id = 1;

function removeNotification(id: string): void {
	const index = notifications.findIndex((notification) => notification.id == id);
	if (index != -1) {
		notifications.splice(index, 1);
	}
}

function newNotification(params: NotificationParams): void {
	const notification: Notification = {
		id: id.toString(),
		message: params.message,
		type: params.type,
	};
	notifications.splice(0, 0, notification);
	if (params.autoclose) {
		setTimeout(() => {
			removeNotification(notification.id);
		}, params.timeout);
	}
	++id;
}

function getNotifications(): Notification[] {
	return notifications.slice(0, 5);
}

export default {
	newNotification,
	getNotifications,
	removeNotification,
}