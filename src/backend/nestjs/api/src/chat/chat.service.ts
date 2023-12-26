import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity , ChannelEntity} from 'src/postgreSQL/entities/chat.entity';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(MessageEntity) private messagesRepository: Repository<MessageEntity>,
		@InjectRepository(ChannelEntity) private channelRepository: Repository<ChannelEntity>
		) {}

	/* MESSAGE */

	//Permet de fetch tous les messages
	async getAllMessages(): Promise<MessageRaw []> {
		return await this.messagesRepository.find() as MessageRaw [];
	}
	
	//Permet de charger les messages d'une conversation
	async getAllMessagesByChannel(channelId: number): Promise<MessageRaw []> {
		const MessageList = await this.messagesRepository.findBy({ channelId: channelId }) as MessageRaw [];
		return MessageList;
	}

	//Permet de créer un message dans la base de données
	async createMessage(message: MessageRaw): Promise<MessageRaw> {
		this.messagesRepository.create(message as MessageEntity);
		return await this.messagesRepository.save(message);
	}

	// /* CHANNEL */

	//Permet de fetch tous les channels
	async getAllChannels(): Promise<Channel []> {
		return await this.channelRepository.find() as Channel [];
	}

	//Permet de fetch un channel par son id
	async getChannelById(id: number): Promise<Channel> {
		return await this.channelRepository.findOneBy({ id: id }) as Channel;
	}

	//Permet de créer un channel dans la base de données
	async createChannel(channel: Channel): Promise<Channel> {
		this.channelRepository.create(channel);
		return await this.channelRepository.save(channel);
	}

}