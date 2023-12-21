export declare class MessageEntity {
    id: number;
    senderId: number;
    channelId: number;
    text: string;
    datestamp: Date;
    timestamp: string;
}
export declare class ChannelEntity {
    id: number;
    name: string;
    creatorId: number;
    modeChanel: 'public' | 'private' | 'protected' | 'secret';
}