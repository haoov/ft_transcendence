interface Message {
	senderId: number;
	channelId: number;
	message: string;
	datestamp: Date;
	timestamp: number;
}

interface Channel {
	id: number;
	name: string;
	creatorId: number;
	modeChanel: 'public' | 'private' | 'protected' | 'secret';
}
