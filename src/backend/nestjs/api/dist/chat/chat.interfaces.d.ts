interface Message {
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
    modeChanel: 'public' | 'private' | 'protected' | 'secret';
}
