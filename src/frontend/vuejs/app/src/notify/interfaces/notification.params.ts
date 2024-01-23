export type NotificationType = "gameInvite" | "gameReady";

export interface NotificationParams {
	message?: string;
	by?: string;
	autoClose?: boolean;
	timeout?: number;
}