interface Message {
    senderId: number;
    channelId: number;
    text: string;
    datestamp: Date;
    timestamp: string;
}
interface Channel {
    name: string;
    creatorId: number;
    mode: 'public' | 'private' | 'protected' | 'secret';
}
