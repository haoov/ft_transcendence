import type { User } from "@/utils";
import type { Message, MessageData } from "@/chat";

export type ChannelParams  = {
	name: string;
	mode: string;
	creatorId: number;
	users: User[];
	messages?: Message[];
}

export type ChannelData = {
	id: number;
	name: string;
	mode: string;
	creatorId: number;
	users: User[];
	messages: MessageData[];
	admins: User[];
	bans: User[];
}