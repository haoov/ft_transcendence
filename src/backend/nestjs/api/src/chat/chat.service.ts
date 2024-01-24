import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity , ChannelEntity} from 'src/postgreSQL/entities/chat.entity';
import { UserEntity } from 'src/postgreSQL/entities/user.entity';
import { MessageRaw, Channel } from './chat.interface';
import { User } from 'src/user/user.interface';

function createChannelObj(channel: any, users: User [], admins : User []) : ChannelEntity {
	const newChannel = new ChannelEntity();
	newChannel.name = channel.name;
	newChannel.creatorId = channel.creatorId;
	newChannel.mode = channel.mode;
	newChannel.password = channel.password;
	newChannel.users = users;
	newChannel.admins = admins;
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

	//Fetch all messages
	async getAllMessages(): Promise<MessageRaw []> {
		return await this.messagesRepository.find() as MessageRaw [];
	}
	
	//Fetch all messages by channel id
	async getAllMessagesByChannel(channelId: number): Promise<MessageRaw []> {
		const messages = await this.messagesRepository.find({ where: { channelId: channelId }});
		return messages as MessageRaw [];
	}

	//Fetch all messages by channel id
	async createMessage(message: MessageRaw): Promise<MessageRaw> {
		this.messagesRepository.create(message as MessageEntity);
		return await this.messagesRepository.save(message);
	}

	// /* CHANNEL */

	//Fetch all channels
	async getAllChannels(): Promise<Channel []> {
		return await this.channelRepository.find() as Channel [];
	}

	//Fetch user all channels by user id
	async getCurrentUserChannels(userId: number): Promise<Channel []> {
		return await this.channelRepository
        .createQueryBuilder("channel")
        .innerJoinAndSelect("channel.users", "user", "user.id = :userId", { userId })
        .getMany();
	}

	//Fetch channel by id
	async getChannelById(channelId: number): Promise<Channel> {
		return await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
	}

	//Fetch users From channel by channel id
	async getUsersByChannelId(channelId: number): Promise<User []> {
		const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
		return channel.users;
	}

	//Fetch banned users From channel by channel id
	async getBannedUsersByChannelId(channelId: number): Promise<User []> {
		const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["bannedUsers"]});
		return channel.bannedUsers;
	}

	//Fetch admins From channel by channel id
	async getAdminsByChannelId(channelId: number): Promise<User []> {
		const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["admins"]});
		return channel.admins;
	}

	//Get all joinable channels (meaning not private or secret and not already joined by the user)
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

	//Create a channel in the database
	async createChannel(channel: any): Promise<Channel> {
		const admins : User [] = [];
		admins.push(await this.userRepository.findOneBy({ id: channel.creatorId }) as User);
		const users : User [] = [];
		for (const idUser of channel.users) {
			const newUser = await this.userRepository.findOneBy({ id: idUser }) as User;
			users.push(newUser);
		}
		const newChannel : ChannelEntity = createChannelObj(channel, users, admins);
		this.channelRepository.create(newChannel);
		return await this.channelRepository.save(newChannel) as Channel;
	}

	// Update a channel in the database
	async updateChannel(channel: Channel): Promise<Channel> {
		const newChannel = await this.channelRepository.findOne({ where: { id: channel.id }, relations: ["users"]});
		newChannel.name = channel.name;
		newChannel.creatorId = channel.creatorId;
		newChannel.mode = channel.mode;
		newChannel.password = channel.password;
		await this.channelRepository.save(newChannel);
		return newChannel;
	}

	//Add a user to a channel
	async addUserToChannel(channelId: number, userId: number): Promise<boolean> {
		const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
		const user = await this.userRepository.findOne({ where: { id: userId }}) as User;
		channel.users.push(user);
		await this.channelRepository.save(channel);
		return true;
	}

	//Delete a user from a channel (kick)
	async removeUserFromChannel(channelId: number, userId: number): Promise<boolean> {
		const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
		const user = await this.userRepository.findOne({ where: { id: userId }}) as User;
		channel.users.splice(channel.users.indexOf(user), 1);
		await this.channelRepository.save(channel);
		return true;
	}

	//Delete a channel
	async deleteChannel(channelId: number): Promise<boolean> {
		const messages = await this.messagesRepository.find({ where: { channelId: channelId }});
		await this.messagesRepository.remove(messages);
		const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["users"]});
		await this.channelRepository.remove(channel);
		return true;
	}

	//Add an admin to a channel
	async addAdminToChannel(channelId: number, userId: number): Promise<boolean> {
		const channel = await this.channelRepository.findOne({ where: { id: channelId }, relations: ["admins"]});
		const user = await this.userRepository.findOne({ where: { id: userId }}) as User;
		channel.admins.push(user);
		await this.channelRepository.save(channel);
		return true;
	}

}