export interface Notification {
	id: string;
	message: string;
	type: string;
	by?: string;
	autoClose?: boolean;
	timeout?: number;
}