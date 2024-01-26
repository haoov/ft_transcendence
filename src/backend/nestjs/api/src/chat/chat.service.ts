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
		return await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
	}

	//Permet de recuperer les utilisateurs d'un channel
	async getUsersByChannelId(channelId: number): Promise<User []> {
		const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
		return channel.users;
	}

	//Permet de recuperer les channels qui ne sont ni prives ni secret et qui ne sont pas deja dans la liste des channels de l'utilisateur
	async getJoinableChannels(userId: number): Promise<Channel []> {
		let channels: Channel [] = [];
		const alreadyJoinedChannels = await this.channelRepository
		.createQueryBuilder("channel")
		.innerJoin("channel.users", "user", "user.id = :userId", { userId })
		.getMany();
		if (alreadyJoinedChannels.length === 0) {
			channels = await this.channelRepository
			.createQueryBuilder("channel")
			.leftJoin("channel.users", "user")
			.where("channel.mode IN (:...modes)", { modes: ['Public', 'Protected'] })
			.andWhere("user.id != :userId", { userId })
			.getMany();
		} else {
			channels = await this.channelRepository
			.createQueryBuilder("channel")
			.where("channel.mode IN (:...modes)", { modes: ['Public', 'Protected'] })
			.andWhere("channel.id NOT IN (:...alreadyJoinedChannelIds)", { alreadyJoinedChannelIds: alreadyJoinedChannels.map(channel => channel.id) })
			.getMany();
		}
		return channels;
	}

	//Permet de créer un channel dans la base de données
	async createChannel(channel: any): Promise<Channel> {
		const users : User [] = [];
		for (const idUser of channel.users) {
			const newUser = await this.userRepository.findOneBy({ id: idUser }) as User;
			users.push(newUser);
		}
		console.log(users);
		const newChannel : ChannelEntity = createChannelObj(channel, users);
		this.channelRepository.create(newChannel);
		return await this.channelRepository.save(newChannel) as Channel;
	}

	//Permet de mettre à jour un channel
	async updateChannel(channel: Channel): Promise<Channel> {
		const newChannel = await this.channelRepository.findOne({ where: { id: channel.id }, relations: ["users"]});
		newChannel.name = channel.name;
		newChannel.creatorId = channel.creatorId;
		newChannel.mode = channel.mode;
		newChannel.password = channel.password;
		await this.channelRepository.save(newChannel);
		return newChannel;
	}

	//Permet d'ajouter un utilisateur à un channel
	async addUserToChannel(channelId: number, userId: number): Promise<boolean> {
		const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
		const user = await this.userRepository.findOne({ where: { id: userId }}) as User;
		channel.users.push(user);
		await this.channelRepository.save(channel);
		return true;
	}

	//Permet de supprimer un utilisateur d'un channel
	async removeUserFromChannel(channelId: number, userId: number): Promise<boolean> {
		const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
		const user = await this.userRepository.findOne({ where: { id: userId }}) as User;
		channel.users.splice(channel.users.indexOf(user), 1);
		await this.channelRepository.save(channel);
		return true;
	}

	//Permet de supprimer un channel
	async deleteChannel(channelId: number): Promise<boolean> {
		const messages = await this.messagesRepository.find({ where: { channelId: channelId }});
		await this.messagesRepository.remove(messages);
		const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
		await this.channelRepository.remove(channel);
		return true;
	}
}