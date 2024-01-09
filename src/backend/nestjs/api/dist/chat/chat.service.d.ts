import { Repository } from 'typeorm';
import { MessageEntity, ChannelEntity } from 'src/postgreSQL/entities/chat.entity';
import { UserEntity } from 'src/postgreSQL/entities/user.entity';
import { MessageRaw, Channel } from './chat.interface';
export declare class ChatService {
    private messagesRepository;
    private channelRepository;
    private userRepository;
    constructor(messagesRepository: Repository<MessageEntity>, channelRepository: Repository<ChannelEntity>, userRepository: Repository<UserEntity>);
    getAllMessages(): Promise<MessageRaw[]>;
    getAllMessagesByChannel(channelId: number): Promise<MessageRaw[]>;
    createMessage(message: MessageRaw): Promise<MessageRaw>;
    getAllChannels(): Promise<Channel[]>;
    getCurrentUserChannels(userId: number): Promise<Channel[]>;
    getChannelById(channelId: number): Promise<Channel>;
    createChannel(channel: any): Promise<Channel>;
    addUserToChannel(channelId: number, userId: number): Promise<boolean>;
}
