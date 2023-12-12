import { Repository } from 'typeorm';
import { MessageEntity, ChannelEntity } from 'src/postgreSQL/entities/chat.entity';
export declare class ChatService {
    private messagesRepository;
    private channelRepository;
    constructor(messagesRepository: Repository<MessageEntity>, channelRepository: Repository<ChannelEntity>);
}
