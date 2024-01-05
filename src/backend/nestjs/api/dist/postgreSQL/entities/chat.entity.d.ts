import { User } from 'src/user/user.interface';
declare class ChannelEntity {
    id: number;
    name: string;
    creatorId: number;
    mode: 'public' | 'private' | 'protected' | 'secret';
    password: string;
    users: User[];
    messages: MessageEntity[];
}
declare class MessageEntity {
    id: number;
    senderId: number;
    channelId: number;
    text: string;
    datestamp: Date;
    timestamp: string;
    channel: ChannelEntity;
}
export { MessageEntity, ChannelEntity };
