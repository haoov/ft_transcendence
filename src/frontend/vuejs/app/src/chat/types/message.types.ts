import type { User } from "@/utils";

export type MessageParams = {
	sender: User;
	channelId: number;
	text: string;
	datestamp: string;
}

export type MessageData = {
	id: number;
	sender: User;
	channelId: number;
	text: string;
	datestamp: string;
}