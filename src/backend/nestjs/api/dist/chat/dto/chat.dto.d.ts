export declare class MessageDTO {
    senderId: number;
    channelId: number;
    message: string;
    datestamp: Date;
    timestamp: number;
}
export declare class ChannelDTO {
    id: number;
    name: string;
    creatorId: number;
    modeChanel: string;
}
