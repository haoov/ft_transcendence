import type { User } from "@/utils";
import type { Message, MessageData } from "@/chat";

export type ChannelParams  = {
	name: string;
	mode: string;
	creatorId: number;
	password?: string;
	users: User[];
	messages?: Message[];
	admins: User[];
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