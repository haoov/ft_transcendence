import { User } from '../user/user.interface';

interface MessageRaw {
	id: number;
	senderId: number;
	channelId: number;
	text: string;
	datestamp: Date;
	timestamp: string;
}

interface Channel {
	id: number;
	name: string;
	creatorId: number;
	mode: string;
	password: string;
	users: User [];
	bannedUsers: User [];
	admins: User [];
}

export { MessageRaw, Channel };