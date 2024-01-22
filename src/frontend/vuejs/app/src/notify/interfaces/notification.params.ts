export type NotificationType = "gameInvite" | "gameReady" | "error" | "success";

export interface NotificationButton {
	text?: string;
	action: () => void;
}

export interface NotificationParams {
	message?: string;
	by?: string;
	autoClose?: boolean;
	timeout?: number;
	timeOutBar?: boolean;
	buttons?: NotificationButton[];
}