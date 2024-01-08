import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity , ChannelEntity} from 'src/postgreSQL/entities/chat.entity';
import { UserEntity } from 'src/postgreSQL/entities/user.entity';
import { MessageRaw, Channel } from './chat.interface';
import { User } from 'src/user/user.interface';

function createChannelObj(channel: any, users: User []) : ChannelEntity {
	const newChannel = new ChannelEntity();
	newChannel.name = channel.name;
	newChannel.creatorId = channel.creatorId;
	newChannel.mode = channel.mode;
	newChannel.password = channel.password;
	newChannel.users = users;
	return newChannel;
}

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(MessageEntity) private messagesRepository: Repository<MessageEntity>,
		@InjectRepository(ChannelEntity) private channelRepository: Repository<ChannelEntity>,
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
		) {}

	/* MESSAGE */

	//Permet de fetch tous les messages
	async getAllMessages(): Promise<MessageRaw []> {
		return await this.messagesRepository.find() as MessageRaw [];
	}
	
	//Permet de charger les messages d'une conversation
	async getAllMessagesByChannel(channelId: number): Promise<MessageRaw []> {
		const messages = await this.messagesRepository.find({ where: { channelId: channelId }});
		return messages as MessageRaw [];
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
	async getCurrentUserChannels(userId: number): Promise<Channel []> {
		return await this.channelRepository
        .createQueryBuilder("channel")
        .innerJoinAndSelect("channel.users", "user", "user.id = :userId", { userId })
        .getMany();
	}

	//Permet de fetch un channel par son id
	async getChannelById(channelId: number): Promise<Channel> {
		return await this.channelRepository.findOne({ where: { id: channelId }});
	}

	//Permet de créer un channel dans la base de données
	async createChannel(channel: any): Promise<Channel> {
		const users : User [] = [];
		for (const idUser of channel.users) {
			const newUser = await this.userRepository.findOneBy({ id: idUser }) as User;
			users.push(newUser);
		}
		const newChannel : ChannelEntity = createChannelObj(channel, users);
		this.channelRepository.create(newChannel);
		return await this.channelRepository.save(newChannel) as Channel;
	}

}