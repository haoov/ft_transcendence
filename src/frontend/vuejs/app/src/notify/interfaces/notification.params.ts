export type NotificationType = "gameInvite" | "gameReady" | "error";

export interface NotificationParams {
	message?: string;
	by?: string;
	autoClose?: boolean;
	timeout?: number;
}