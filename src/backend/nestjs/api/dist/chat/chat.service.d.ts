import { Repository } from 'typeorm';
import { MessageEntity, ChannelEntity } from 'src/postgreSQL/entities/chat.entity';
export declare class ChatService {
    private messagesRepository;
    private channelRepository;
    constructor(messagesRepository: Repository<MessageEntity>, channelRepository: Repository<ChannelEntity>);
    getAllMessagesByChannel(channelId: number): Promise<Message[]>;
    createMessage(message: Message): Promise<Message>;
    saveMessage(message: Message): Promise<Message>;
    getAllChanel(): Promise<Channel[]>;
    createChannel(channel: Channel): Promise<Channel>;
    saveChannel(idEditor: number, idChannel: number, channel: Channel): Promise<Channel>;
    deleteChannel(idChannel: number, idUser: number): Promise<Channel>;
}
