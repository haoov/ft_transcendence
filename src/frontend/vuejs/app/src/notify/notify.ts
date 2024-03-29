import { reactive } from "vue";
import type { Notification, NotificationParams, NotificationType } from "./interfaces";
import { success, error, infos } from "../assets/images/notifyIcons";
import warning from "../assets/images/notifyIcons/warning.png";

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
		type: "",
	};
	switch (type) {
		case "invite":
			notification.message = params?.message || "Invite";
			notification.type = "invite";
			notification.by = params?.by;
			notification.autoClose = (params?.autoClose != undefined ? params.autoClose : false);
			notification.timeout = params?.timeout || 5000;
			notification.timeOutBar = (params?.timeOutBar != undefined ? params.timeOutBar : false)
			notification.buttons = [
				{
					text: "accept",
					action: () => {
						params?.buttons?.[0].action();
						removeNotification(notification.id);
					}
				},
				{
					text: "decline",
					action: () => {
						params?.buttons?.[1].action();
						removeNotification(notification.id);
					}
				}
			];
			break;
		case "gameReady":
			notification.message = params?.message || "Ready to play!";
			notification.type = "gameReady";
			notification.by = params?.by;
			notification.autoClose = (params?.autoClose != undefined ? params.autoClose : true);
			notification.timeout = params?.timeout || 10000;
			notification.timeOutBar = (params?.timeOutBar != undefined ? params.timeOutBar : true)
			notification.buttons = [
				{
					text: "play",
					action: () => {
						params?.buttons?.[0].action();
						removeNotification(notification.id);
					}
				}
			];
			break;
		case "error":
			notification.message = params?.message || "Error";
			notification.type = "error";
			notification.by = params?.by;
			notification.autoClose = (params?.autoClose != undefined ? params.autoClose : true);
			notification.timeout = params?.timeout || 3000;
			notification.timeOutBar = params?.timeOutBar || false;
			notification.icon = error;
			notification.buttons = params?.buttons;
			break;
		case "success":
			notification.message = params?.message || "Success";
			notification.type = "success";
			notification.autoClose = (params?.autoClose != undefined ? params.autoClose : true);
			notification.timeout = params?.timeout || 3000;
			notification.timeOutBar = params?.timeOutBar || false;
			notification.icon = success;
			notification.buttons = params?.buttons;
			break;
		case "infos":
			notification.message = params?.message || "Infos";
			notification.type = "infos";
			notification.by = params?.by;
			notification.autoClose = (params?.autoClose != undefined ? params.autoClose : true);
			notification.timeout = params?.timeout || 3000;
			notification.timeOutBar = params?.timeOutBar || false;
			notification.icon = infos;
			notification.buttons = params?.buttons ? [
				{
					text: params?.buttons?.[0].text || "ok",
					action: () => {
						params?.buttons?.[0].action();
						removeNotification(notification.id);
					}
				},
				{
					text: params?.buttons?.[1].text || "cancel",
					action: () => {
						params?.buttons?.[1].action();
						removeNotification(notification.id);
					}
				}
			] : undefined;
				break;
			case "warning":
				notification.message = params?.message || "Infos";
				notification.type = "infos";
				notification.by = params?.by;
				notification.autoClose = (params?.autoClose != undefined ? params.autoClose : true);
				notification.timeout = params?.timeout || 3000;
				notification.timeOutBar = params?.timeOutBar || false;
				notification.icon = warning;
				notification.buttons = params?.buttons ? [
					{
						text: params?.buttons?.[0].text || "ok",
						action: () => {
							params?.buttons?.[0].action();
							removeNotification(notification.id);
						}
					},
					{
						text: params?.buttons?.[1].text || "cancel",
						action: () => {
							params?.buttons?.[1].action();
							removeNotification(notification.id);
						}
					}
				] : undefined;
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