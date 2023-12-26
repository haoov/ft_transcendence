import { Repository } from 'typeorm';
import { MessageEntity, ChannelEntity } from 'src/postgreSQL/entities/chat.entity';
export declare class ChatService {
    private messagesRepository;
    private channelRepository;
    constructor(messagesRepository: Repository<MessageEntity>, channelRepository: Repository<ChannelEntity>);
    getAllMessages(): Promise<MessageRaw[]>;
    getAllMessagesByChannel(channelId: number): Promise<MessageRaw[]>;
    createMessage(message: MessageRaw): Promise<MessageRaw>;
    getAllChannels(): Promise<Channel[]>;
    getChannelById(id: number): Promise<Channel>;
    createChannel(channel: Channel): Promise<Channel>;
}
