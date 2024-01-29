import { User } from '../user/user.interface';

interface Message {
	id: number;
	sender: User;
	channelId: number;
	text: string;
	datestamp: string;
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
	messages: Message[];
}

export { Message, Channel };