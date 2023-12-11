export declare class MessageEntity {
    id: number;
    senderId: number;
    channelId: number;
    message: string;
    datestamp: Date;
    timestamp: number;
}
export declare class ChannelEntity {
    id: number;
    name: string;
    creatorId: number;
    modeChanel: string;
}
