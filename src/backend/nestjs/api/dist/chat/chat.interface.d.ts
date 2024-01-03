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
    mode: 'public' | 'private' | 'protected' | 'secret';
    password: string;
    users: User[];
}
export { MessageRaw, Channel };
