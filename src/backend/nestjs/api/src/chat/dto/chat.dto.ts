import { User } from "src/user/user.interface";

export class MessageDTO {
	senderId: number;
	channelId: number;
	message: string;
	datestamp: Date;
	timestamp: number;
}

export class ChannelDTO {
	id: number;
	name: string;
	creatorId: number;
	modeChanel: string;
	password: string;
	users: User [];
}